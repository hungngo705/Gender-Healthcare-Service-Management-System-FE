# Gender Healthcare Service Management System

A comprehensive web application built with React, Vite, and Tailwind CSS to provide gender-sensitive healthcare services and information.

## Features

- **Gender-Sensitive Healthcare Services**: Comprehensive catalog of reproductive and sexual health services
- **Menstrual Cycle Tracking**: Tools for monitoring and predicting menstrual cycles
- **Educational Resources**: Blog articles and resources about gender-specific health concerns
- **Appointment Booking**: Simple interface for scheduling healthcare consultations
- **User-Friendly Interface**: Modern, responsive design optimized for all devices
- **Secure Authentication**: Protected routes and user account management

## Technologies

- React.js
- React Router
- Axios
- Vite
- Tailwindcss
- Framer Motion for animations
- Lucide Icons
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/Gender-Healthcare-Service-Management-System-FE.git
cd Gender-Healthcare-Service-Management-System-FE
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:
   Create a `.env` file with the following variables:

```
VITE_API_URL=https://api.example.com
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── pages/          # Application pages
├── hooks/          # Custom React hooks
├── services/       # API services
├── utils/          # Utility functions
├── App.jsx         # Main component
└── main.jsx        # Entry point
```

## API Integration

The project uses Axios for API calls. API endpoints are organized in the `services/api.js` file.

Currently using simulated data for development - replace with actual endpoints when connecting to a backend.

## Key Features Implementation

- **Responsive Design**: Fully responsive layout using Tailwind CSS for all device sizes
- **Interactive UI**: Smooth animations and transitions with Framer Motion
- **Authentication Flow**: Complete login/signup process with validation
- **Protected Routes**: Secure access to user-specific features
- **Service Catalog**: Categorized healthcare services with detailed information
- **Blog Articles**: Educational content about reproductive and sexual health
- **Cycle Tracking**: Interactive tools for monitoring menstrual cycles and fertility windows

## Development Approach

This project follows a component-based architecture with:

- Separation of concerns between UI components and business logic
- Context API for global state management
- Responsive design principles throughout
- Accessibility considerations built into UI components

## Current Status

The project is in active development with frontend implementation nearly complete. Backend integration is the next phase of development.
