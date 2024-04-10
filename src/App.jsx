import { AuthProvider } from './context/AuthContext';
import { ActivityProvider } from './context/ActivityContext';
import { AssignmentProvider } from './context/AssigmentContext.jsx';
import AppRoutes from "./routes/AppRoutes.jsx"
import { BrowserRouter as Router } from 'react-router-dom';


function App() {

  return (
    <>
      <Router>
        <ActivityProvider>
          <AuthProvider>
            <AssignmentProvider>
              <AppRoutes />
            </AssignmentProvider>
          </AuthProvider>
        </ActivityProvider>
      </Router>
    </>
  )
}

export default App
