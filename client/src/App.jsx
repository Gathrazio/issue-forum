import Auth from './components/Auth'
import Profile from './components/Profile'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from './context/UserProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import AllIssues from './components/AllIssues'
import './index.css'

export default function App () {

  const { userInfo: {token}, logout } = useContext(UserContext);

  return (
    <div className="app-wrapper">
      <Routes>
        <Route
          path="/"
          element={ token ? <Navigate to="/profile" /> : <Auth />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute token={token} redirectTo="/">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute token={token} redirectTo="/">
              <AllIssues />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}
