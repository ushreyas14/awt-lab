import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function AuthApp() {
  const { user } = useAuth()

  if (user) {
    return <Dashboard />
  }

  return <Login />
}

function App() {
  return (
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  )
}

export default App
