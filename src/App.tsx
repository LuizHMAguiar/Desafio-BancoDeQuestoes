import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LoginScreen } from "./components/LoginScreen";
import { QuestionBank } from "./components/QuestionBank";
import { NewQuestionPage } from "./components/NewQuestionPage";
import { EditQuestionPage } from "./components/EditQuestionPage";
import { AdminPanel } from "./components/AdminPanel";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { User } from "./types/question";

// Mock user authentication
function AnimatedRoutes({
  user,
  handleLogin,
  handleLogout,
}: {
  user: User | null;
  handleLogin: (email: string, password: string) => void;
  handleLogout: () => void;
}) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginScreen onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <QuestionBank
                user={user!}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questoes/nova"
          element={
            <ProtectedRoute user={user}>
              <NewQuestionPage
                user={user!}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questoes/:id/editar"
          element={
            <ProtectedRoute user={user}>
              <EditQuestionPage
                user={user!}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} requireRole="coordenador">
              <AdminPanel
                user={user!}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (email: string, password: string) => {
    // Mock login with role determination
    let mockUser: User;
    
    if (email === 'coordenador@escola.com') {
      mockUser = {
        id: 'coord-1',
        name: 'Coordenador',
        email: email,
        role: 'coordenador',
      };
    } else if (email === 'professor@escola.com') {
      mockUser = {
        id: 'prof-1',
        name: 'Professor',
        email: email,
        role: 'professor',
      };
    } else {
      // Default to professor for any other email
      mockUser = {
        id: `user-${Date.now()}`,
        name: email.split("@")[0],
        email: email,
        role: 'professor',
      };
    }
    
    setUser(mockUser);
    localStorage.setItem(
      "currentUser",
      JSON.stringify(mockUser),
    );
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster />
      <AnimatedRoutes
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </BrowserRouter>
  );
}