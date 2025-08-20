import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, TABLES } from '../supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simplified user profile creation
  const ensureUserProfile = async (user) => {
    if (!user) return;
    
    try {
      // Quick check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from(TABLES.USERS)
        .select('id')
        .eq('id', user.id)
        .single();

      // Only create profile if it doesn't exist
      if (checkError && checkError.code === 'PGRST116') {
        await supabase
          .from(TABLES.USERS)
          .insert([{
            id: user.id,
            first_name: user.user_metadata?.first_name || 'User',
            last_name: user.user_metadata?.last_name || '',
            email: user.email,
            department: user.user_metadata?.department || 'General',
            position: user.user_metadata?.position || 'Employee'
          }]);
      }
    } catch (error) {
      console.error('Profile setup error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            // Don't wait for profile setup - do it in background
            ensureUserProfile(session.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Session error:', error);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        if (session?.user) {
          setUser(session.user);
          // Background profile setup
          ensureUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: userData }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
