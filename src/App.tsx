import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SelectBranch from "./pages/SelectBranch"; // Import new page
import SelectSemester from "./pages/SelectSemester"; // Import new page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/select-branch" element={<SelectBranch />} />
          <Route
            path="/select-semester/:branchId"
            element={<SelectSemester />}
          />
          <Route
            path="/dashboard/:branchId/:semesterId"
            element={<Dashboard />}
          />
          {/* Keep the old /dashboard route to redirect or handle, or remove if not needed */}
          <Route path="/dashboard" element={<SelectBranch />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;