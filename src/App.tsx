import { Routes, Route } from "react-router-dom";
import LoginWindow from "./pages/login/LoginWindow";
import ResetPasswordWindow from "./pages/reset/ResetPasswordWindow";
import RecoverPasswordWindow from "./pages/recover/RecoverPasswordWindow";
import RegisterWindow from "./pages/register/RegisterWindow";
import VerifyEmailWindow from "./pages/verify/VerifyEmailWindow";
import CheckEmailWindow from "./pages/verify/CheckEmailWindow";
import HomeWindow from "./pages/home/HomeWindow";
import HomeWelcomeWindow from "./pages/home/views/homeWelcome/HomeWelcomeWindow";
import MyDriveWindow from "./pages/home/views/myDrive/MyDriveWindow";
import ProfileWindow from "./pages/home/profile/ProfileWindow";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Componente funcional que representa la aplicación principal.
 *
 * - Controla la autenticación y el refresco de tokens.
 * - Gestiona la pantalla de carga durante los cambios de ruta.
 * - Define las rutas principales de la aplicación.
 */
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginWindow />} />
        <Route path="/login" element={<LoginWindow />} />
        <Route path="/register" element={<RegisterWindow />} />
        <Route path="/verify-email" element={<VerifyEmailWindow />} />
        <Route path="/check-email" element={<CheckEmailWindow />} />
        <Route
          path="/home/*"
          element={
            <ProtectedRoute>
              <HomeWindow />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<HomeWelcomeWindow />} />
          <Route path="my-drive" element={<MyDriveWindow />} />
          <Route path="profile" element={<ProfileWindow />} />
        </Route>
        <Route path="/recover-password" element={<RecoverPasswordWindow />} />
        <Route path="/reset-password" element={<ResetPasswordWindow />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
