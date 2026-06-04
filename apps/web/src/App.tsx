
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoute.js';

export default function App() {
  return <RouterProvider router={router} />
}
