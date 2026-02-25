import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="auth-container">
      <div className="dashboard-card">
        <h2>Welcome, {user.name}!</h2>
        <button className="auth-btn logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Dashboard
