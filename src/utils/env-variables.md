# Environment Variables Documentation

This document describes the environment variables used in the project.

## API Configuration

```
VITE_API_URL=://your-api-url.com
```

## Feature Flags

```
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=false
```

## Application Settings

```
VITE_APP_NAME=Gender Healthcare Service Management System
VITE_APP_ENV=development
```

## How to Use

1. Create a `.env` file in the root of the project
2. Copy the variables above and set their values as needed
3. Restart the development server

Note: In Vite, environment variables must be prefixed with `VITE_` to be exposed to the client-side code.
