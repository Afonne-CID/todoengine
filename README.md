# todoengine - Task Management Web App

TodoEngine is a simple, yet powerful, task management application built with React and Django. It allows users to create, edit, and delete tasks, as well as manage their personal accounts.

![todoengine Screenshot](./screenshot.PNG)

## Features

- User authentication (login, registration, and logout)
- Task management (add, edit, and delete tasks)
- Mobile-responsive design
- Secure and fast API built with Django and PostgreSQL

## Technologies

- React
- TailwindCSS
- Supabase
- Vercel

## Getting Started

### Prerequisites

- Node.js
- npm
- vite
- supabase (for database and authentication)
- virtualenv (optional, but recommended)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Afonne-CID/todoengine.git
```

2. Set up the frontend:

   a. Navigate to the `todoengine` folder:
   ```bash
   cd todoengine
   ```

   b. Install the dependencies:
   ```bash
   yarn install
   ```

   c. Set environemnt variables:
      - rename `env.example` and fill in appropriate details

   d. Start the development server:
   ```bash
   yarn dev
   ```

3. Open your browser and go to [http://localhost:5173](http://localhost:5173) to view the app. Or the right port if you changed the default port.

## Deployment

This project can be deployed using [Vercel](https://vercel.com) or any other free/paid services that can host an SPA.

Make sure to update the `API_URL` in the `todoengine/src/helpers/index.js` and `todoengine/src/components/AuthButtons.js` files to point to the correct API URL for your backend deployment.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.