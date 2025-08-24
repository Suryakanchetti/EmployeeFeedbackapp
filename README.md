# Employee Feedback Application

A modern React-based web application for managing employee feedback within organizations. Built with React, Supabase, and modern web technologies.

## Features

- 🔐 **User Authentication**: Secure login/register system with Supabase Auth
- 📝 **Feedback Management**: Submit, view, and manage employee feedback
- 👥 **User Profiles**: Personal profile management and feedback history
- 🎛️ **Admin Panel**: Administrative controls for feedback management
- 📱 **Responsive Design**: Mobile-friendly interface
- 🚀 **Real-time Updates**: Live feedback updates using Supabase realtime

## Tech Stack

- **Frontend**: React 18, React Router, CSS3
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Netlify
- **Icons**: Lucide React

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd EmployeeFeedbackapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Deployment to Netlify

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy the application**
   ```bash
   netlify deploy --prod --dir=build
   ```

4. **Set environment variables**
   - Go to your Netlify dashboard
   - Navigate to Site settings → Environment variables
   - Add: `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_ANON_KEY`

### Option 2: Deploy via Netlify Dashboard

1. **Push your code to GitHub**
2. **Go to [netlify.com](https://netlify.com)**
3. **Import your repository**
4. **Configure environment variables in the dashboard**
5. **Deploy**

### Environment Variables Setup

In your Netlify project settings, add these environment variables:

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Set up the database schema** using the provided SQL file:
   ```bash
   # Run the database setup script
   psql -h your-project-ref.supabase.co -U postgres -d postgres -f database-setup-complete.sql
   ```
3. **Get your project credentials** from the API settings
4. **Update your environment variables** with the credentials

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminPanel.js   # Admin interface
│   ├── Dashboard.js    # Main dashboard
│   ├── FeedbackForm.js # Feedback submission
│   ├── FeedbackList.js # Feedback display
│   ├── FeedbackModal.js # Feedback details
│   ├── Login.js        # Login form
│   ├── Navbar.js       # Navigation
│   └── Profile.js      # User profile
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication context
├── App.js             # Main application
├── index.js           # Entry point
└── supabase.js        # Supabase configuration
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase project set up
- [ ] Database schema imported
- [ ] Code pushed to repository
- [ ] Netlify project created
- [ ] Environment variables added to Netlify
- [ ] Domain configured (optional)
- [ ] SSL certificate active

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables start with `REACT_APP_`
   - Restart development server after adding variables

2. **Supabase Connection Issues**
   - Verify URL and API key are correct
   - Check Supabase project status
   - Ensure proper CORS configuration

3. **Build Failures**
   - Check for syntax errors
   - Verify all dependencies are installed
   - Check Node.js version compatibility

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check Vercel deployment logs
4. Open an issue in the repository

## License

This project is licensed under the MIT License.
