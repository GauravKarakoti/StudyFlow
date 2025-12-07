import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import axios from "axios";
import GlobalNavigation from "./components/GlobalNavigation";
import { useEffect, Suspense, lazy } from "react";
import Loading from "./components/Loading";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SelectCourse = lazy(() => import("./pages/SelectCourse"));
const SelectBranch = lazy(() => import("./pages/SelectBranch"));
const SelectSemester = lazy(() => import("./pages/SelectSemester"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// Learn pages
const LearnLayout = lazy(() =>
  import("./pages/Learn/LearnLayout").then((module) => ({
    default: module.LearnLayout,
  }))
);
const LearnMap = lazy(() => import("./pages/Learn/LearnMap"));
const LearnCourses = lazy(() => import("./pages/Learn/LearnCourses"));
const LeaderboardPage = lazy(() => import("./pages/Learn/LeaderboardPage"));
const ForumPage = lazy(() => import("./pages/Learn/ForumPage"));
const LessonPage = lazy(() => import("./pages/Learn/LessonPage"));
const ForumThreadPage = lazy(() => import("./pages/Learn/ForumThreadPage"));

async function wakeup() {
  try {
    await axios.get(`${import.meta.env.VITE_BACKEND_URL}/`);
    console.log("Backend wakeup call successful");
  } catch (error) {
    console.error("Backend wakeup failed", error);
  }
}
wakeup();

const queryClient = new QueryClient();

const App = () => {
  // Added global theme initialization
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    // Default to dark if no preference is stored or if it is 'dark'
    if (!storedTheme || storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalNavigation />
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes (Logged-in users) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/select-course" element={<SelectCourse />} />
                <Route
                  path="/select-branch/:courseId"
                  element={<SelectBranch />}
                />
                <Route
                  path="/select-semester/:courseId/:branchId"
                  element={<SelectSemester />}
                />
                <Route
                  path="/dashboard/:courseId/:branchId/:semesterId"
                  element={<Dashboard />}
                />
                <Route path="/dashboard" element={<SelectCourse />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/learn"
                  element={
                    <LearnLayout>
                      <LearnMap />
                    </LearnLayout>
                  }
                />
                <Route
                  path="/learn/courses"
                  element={
                    <LearnLayout>
                      <LearnCourses />
                    </LearnLayout>
                  }
                />
                <Route
                  path="/learn/lesson/:lessonId"
                  element={<LessonPage />}
                />
                <Route
                  path="/learn/leaderboard"
                  element={
                    <LearnLayout>
                      <LeaderboardPage />
                    </LearnLayout>
                  }
                />
                <Route
                  path="/learn/forum"
                  element={
                    <LearnLayout>
                      <ForumPage />
                    </LearnLayout>
                  }
                />
                <Route
                  path="/learn/forum/:threadId"
                  element={
                    <LearnLayout>
                      <ForumThreadPage />
                    </LearnLayout>
                  }
                />
              </Route>

              {/* Admin Routes (Admin users only) */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
