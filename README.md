# Employee Feedback App

A modern web application built with React and Supabase for managing employee feedback and performance reviews.

## Features

- **User Authentication**: Secure login and registration system
- **Feedback Management**: Create, view, and manage employee feedback
- **Admin Panel**: Administrative controls for user management
- **Dashboard**: Overview of feedback statistics and recent activities
- **Profile Management**: User profile customization and settings
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React.js, React Router, CSS3
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd EmployeeFeedbackapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

## Database Setup

The application includes a complete database setup script (`database-setup-complete.sql`) that creates all necessary tables and relationships for the feedback system.

## Deployment

This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
