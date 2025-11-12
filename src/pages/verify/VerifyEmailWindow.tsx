import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./verifyWindow.css";
import { Alert } from "../../commons/Alert";
import { useAuth } from "../../contexts/AuthContext";

export default function VerifyEmailWindow() {
  const location = useLocation();
  const navigate = useNavigate();
  const stateAny = location.state as any;
  const initialEmail = stateAny?.email || localStorage.getItem("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const { sendVerificationEmail } = useAuth();

  const handleSend = async () => {
    setShowError(false);
    if (!email || !email.includes("@")) {
      setError("Ingrese un correo válido.");
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }
    setLoading(true);
    const resp = await sendVerificationEmail(email);
    setLoading(false);
    if (resp.success) {
      // Navigate back to login and show a success message there
      setCooldown(60);
      navigate("/login", {
        state: {
          verifySentMessage: "Correo de verificación enviado con éxito.",
        },
      });
      return;
    }

    setError(resp.error || "No se pudo enviar el correo.");
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  useEffect(() => {
    let t: any;
    if (cooldown > 0) {
      t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    }
    return () => clearInterval(t);
  }, [cooldown]);

  return (
    <div className="verify-page">
      <Alert type="error" message={error} show={showError} />
      <div className="verify-window">
        <h2>Verificar correo</h2>
        <p className="verify-instructions">
          Para completar el registro, debes verificar tu correo. Ingresa tu
          dirección y te enviaremos el enlace de verificación.
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
            className={`verify-submit ${loading ? "loading" : ""}`}
            onClick={handleSend}
            disabled={loading || cooldown > 0}
          >
            {cooldown > 0
              ? `Enviando de nuevo (${cooldown}s)`
              : loading
              ? "Enviando..."
              : "Enviar correo de verificación"}
          </button>

          <button className="verify-back" onClick={() => navigate("/login")}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
