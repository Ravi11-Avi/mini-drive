import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import SignUp from './pages/Signup.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Drive from './pages/Drive.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Add a fallback route */}
        <Route path="*" element={<Navigate to="/login" replace />} />



        <Route path='/drive' element={

          <ProtectedRoute>

            <Drive/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App