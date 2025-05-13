# Gender Healthcare Service Management System

A comprehensive web application built with React and Vite to manage gender-specific healthcare services.

## Features

- **Patient Management**: Efficiently manage patient records and appointments
- **Healthcare Services**: Comprehensive catalog of gender-specific healthcare services
- **Resource Management**: Optimize healthcare resources and staff scheduling
- **User-Friendly Interface**: Modern, responsive design for all devices

## Technologies

- React.js
- React Router
- Axios
- Vite
- CSS

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
