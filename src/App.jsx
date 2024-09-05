import { useState } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/AppLayout.jsx';
import LandingPages from './pages/LandingPages.jsx';
import RedirectLink from './pages/RedirectLink.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Auth from './pages/Auth.jsx';
import Link from './pages/Link.jsx';
import UrlProvider from './contextApi.jsx';
import ProtectRout from './components/ProtectRout';

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: '/',
          element: <LandingPages />,
        },
        {
          path: '/dashboard',
          element: (
            <ProtectRout>
              <Dashboard />
            </ProtectRout>
          ),
        },
        {
          path: '/auth',
          element: <Auth />,
        },
        {
          path: '/link/:id',
          element: (
            <ProtectRout>
              <Link />
            </ProtectRout>
          ),
        },
        // Separate RedirectLink from protected routes
        {
          path: '/:id',
          element: <RedirectLink />,
        },
      ],
    },
  ]);

  return (
    <UrlProvider>
      <RouterProvider router={router}></RouterProvider>
    </UrlProvider>
  );
}

export default App;
