import LoginPage from "./views/Login/LoginPage.jsx"
import { AuthProvider } from './context/AuthContext';
import AppRoutes from "./routes/AppRoutes.jsx"
import { BrowserRouter as Router } from 'react-router-dom';

function App() {

  return (
    <>
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      </Router>
    </>
  )
}

export default App
