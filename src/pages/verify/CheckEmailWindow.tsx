import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./verifyWindow.css";
import { Alert } from "../../commons/Alert";
import { useAuth } from "../../contexts/AuthContext";

export default function CheckEmailWindow() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateAny = location.state as any;
  const initialEmail = stateAny?.email || localStorage.getItem("email") || "";
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { sendVerificationEmail } = useAuth();

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || !email.includes("@")) {
      setError("Ingrese un correo válido.");
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }
    setSending(true);
    const resp = await sendVerificationEmail(email);
    setSending(false);
    if (resp.success) {
      setCooldown(60);
      // navigate back to login with message
      navigate("/login", {
        state: {
          verifySentMessage: "Correo de verificación enviado con éxito.",
        },
      });
    } else {
      setError(resp.error || "No se pudo enviar el correo.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="verify-page">
      <Alert type="error" message={error} show={showError} />
      <div className="verify-window">
        <h2>Revisa tu correo</h2>
        <p className="verify-instructions">
          Hemos enviado un correo para verificar tu cuenta a{" "}
          <strong>{email}</strong>. Si no recibiste el correo, puedes
          reenviarlo.
        </p>
        <div className="verify-form">
          <input
            className="verify-input"
            type="email"
            value={email}
            placeholder="Correo electrónico"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="verify-submit"
            onClick={handleResend}
            disabled={sending || cooldown > 0}
          >
            {cooldown > 0
              ? `Reenviar (${cooldown}s)`
              : sending
              ? "Enviando..."
              : "Reenviar correo de verificación"}
          </button>

          <button className="verify-back" onClick={() => navigate("/login")}>
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
