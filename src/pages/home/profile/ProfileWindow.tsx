import React, { useState, useRef, useEffect } from "react";
import "./profileWindow.css";
import Modal from "../../../commons/Modal";
import {
  request2faSetup,
  confirm2fa,
} from "../../../services/auth/auth.service";
import { Alert } from "../../../commons/Alert";

const ProfileWindow: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const open2fa = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    const resp = await request2faSetup();
    setLoading(false);
    if (!resp.success) {
      const msg = resp.error || "Error al solicitar configuración 2FA";
      setError(msg);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setError(""), 3000);
      setShowModal(false);
      return;
    }

    const data = resp.data ?? {};
    setQrData(data.qrBase64 || null);
    setOtpauthUrl(data.otpauthUrl || null);
    setSecret(data.secret || null);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    const resp = await confirm2fa(code.trim());
    setLoading(false);
    if (!resp.success) {
      const msg = resp.error || "Código inválido";
      setError(msg);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setError(""), 3000);
      return;
    }
    const okMsg = "2FA activado correctamente.";
    setSuccess(okMsg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSuccess(""), 3000);
    setShowModal(false);
    setCode("");
  };

  return (
    <div className="profile-page">
      <h2>Mi Perfil</h2>

      <section className="profile-section">
        <h3>Información</h3>
      </section>

      <section className="profile-section">
        <h3>Seguridad</h3>
        <div className="profile-row">
          <label>Autenticación en dos pasos (2FA)</label>
          <div className="profile-value">
            <button className="btn" onClick={open2fa} disabled={loading}>
              Activar 2FA
            </button>
          </div>
        </div>
      </section>

      <Alert type="error" message={error} show={!!error} />
      <Alert type="success" message={success} show={!!success} />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Configurar 2FA"
      >
        <div className="twofa-modal">
          {qrData ? (
            <div className="qr-wrapper">
              <img src={qrData} alt="QR 2FA" />
            </div>
          ) : otpauthUrl ? (
            <div className="otpauth">{otpauthUrl}</div>
          ) : (
            <div className="secret">
              {secret ? `Clave: ${secret}` : "No se obtuvo QR"}
            </div>
          )}

          <p className="twofa-instructions">
            Escanea el QR con tu app de autenticación (Google Authenticator,
            Authy) y luego ingresa el código de 6 dígitos para confirmar.
          </p>

          <div className="twofa-actions">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
            />
            <div className="twofa-buttons">
              <button
                className="btn"
                onClick={handleConfirm}
                disabled={loading || code.length < 6}
              >
                Confirmar
              </button>
              <button className="btn" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileWindow;
