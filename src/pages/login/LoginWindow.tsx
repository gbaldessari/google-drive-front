import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./loginWindow.css";
import { useAuth } from "../../contexts/AuthContext";
import { z } from "zod";
import { Alert } from "../../commons/Alert";
import { LoginForm } from "./subcomponents/LoginForm";

const emailSchema = z.email("Por favor, ingrese un correo electrónico válido.");
const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(16, "La contraseña no puede tener más de 16 caracteres.")
  .regex(/[A-Za-z]/, "La contraseña debe incluir al menos una letra.")
  .regex(/\d/, "La contraseña debe incluir al menos un número.");

/**
 * LoginWindow
 *
 * Componente principal para el inicio de sesión de usuarios.
 * Gestiona el estado de los campos, validación, alertas y navegación.
 */
function LoginWindow() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();

  // If we were navigated here with a message from verify-email page, show it
  useEffect(() => {
    const stateAny = location.state as any;
    if (stateAny?.verifySentMessage) {
      setSuccess(stateAny.verifySentMessage as string);
      setShowSuccess(true);
      // clear message so it doesn't re-show on re-render
      try {
        navigate(location.pathname, { replace: true, state: {} });
      } catch (e) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.issues?.[0]?.message || "Datos inválidos.");
      } else {
        setError("Datos inválidos.");
      }
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    setLoading(true);
    setShowError(false);
    const response = await auth.login(email, password);

    if (response.success) {
      setSuccess("Inicio de sesión exitoso.");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/home");
        setLoading(false);
      }, 1200);
      return;
    }

    // If login failed due to unverified email, redirect to verify page
    if (response.errorCode === "email-not-verified") {
      navigate("/verify-email", { state: { email } });
      setLoading(false);
      return;
    }

    console.error(response.error);
    setShowError(true);
    setError(
      response.error || "Error desconocido durante el inicio de sesión."
    );
    setTimeout(() => setShowError(false), 2000);
    setLoading(false);
  };

  return (
    <div>
      {/* Alertas de error y éxito */}
      <Alert type="error" message={error} show={showError} />
      <Alert type="success" message={success} show={showSuccess} />
      {/* Logo de la aplicación */}
      <img src="assets/LOGO2.png" alt="Logo" className="logo" />
      <div className="login-window">
        {/* Formulario de login */}
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          loading={loading}
          handleSubmit={handleSubmit}
        />
        <button
          className="register-button"
          onClick={() => navigate("/register")}
        >
          ¿No tienes una cuenta? Regístrate
        </button>
        {/* Botón para recuperar contraseña */}
        <button
          className="recover-password"
          onClick={() => navigate("/recover-password")}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}

export default LoginWindow;
