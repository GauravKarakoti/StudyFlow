import { useAuth } from '@/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

const AdminRoute = () => {
  const { isAdmin } = useAuth()
  console.log('AdminRoute - isAdmin:', isAdmin())
  // You could redirect to a specific 'unauthorized' page
  // or just back to the main dashboard
  return isAdmin() ? <Outlet /> : <Navigate to="/select-course" replace />
}

export default AdminRoute