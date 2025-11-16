import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./hooks/useAuth.tsx"

createRoot(document.getElementById("root")!).render(
    <AuthProvider> {/* Wrap App with AuthProvider */}
        <App />
    </AuthProvider>
);
