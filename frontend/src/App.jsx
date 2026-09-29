import AppRoutes from './routes/AppRoutes.jsx';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'next-themes';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;