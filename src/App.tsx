import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import SelectCourse from "./pages/SelectCourse"
import SelectBranch from "./pages/SelectBranch"
import SelectSemester from "./pages/SelectSemester"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import AdminDashboard from "./pages/AdminDashboard"
import Settings from "./pages/Settings"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (Logged-in users) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/select-course" element={<SelectCourse />} />
            <Route path="/select-branch/:courseId" element={<SelectBranch />} />
            <Route
              path="/select-semester/:courseId/:branchId"
              element={<SelectSemester />}
            />
            <Route
              path="/dashboard/:courseId/:branchId/:semesterId"
              element={<Dashboard />}
            />
            <Route path="/dashboard" element={<SelectCourse />} />
            <Route path="/settings" element={<Settings />} /> {/* Add Settings Route */}
          </Route>

          {/* Admin Routes (Admin users only) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App