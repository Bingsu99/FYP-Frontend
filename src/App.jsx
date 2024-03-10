import { AuthProvider } from './context/AuthContext';
import { ActivityProvider } from './context/ActivityContext';
import AppRoutes from "./routes/AppRoutes.jsx"
import { BrowserRouter as Router } from 'react-router-dom';

function App() {

  return (
    <>
    <Router>
      <ActivityProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ActivityProvider>
      </Router>
    </>
  )
}

export default App
