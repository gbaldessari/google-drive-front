import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registerWindow.css";
import { Alert } from "../../commons/Alert";
import { register } from "../../services/auth/auth.service";
import { RegisterForm } from "./subcomponents/RegisterForm";

function RegisterWindow() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!fullName.trim()) return "Ingresa tu nombre completo";
    if (fullName[0] === " ") return "El nombre no debe comenzar con un espacio";
    const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
    if (nameParts.length < 2) return "Ingresa al menos nombre y apellido";
    const fullNamePattern = /^[A-Za-zÀ-ÿ]+(?:\s+[A-Za-zÀ-ÿ]+)*$/;
    if (!fullNamePattern.test(fullName.trim()))
      return "El nombre solo debe contener letras";
    if (username.trim().length < 3)
      return "Nombre de usuario mínimo 3 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email inválido";
    if (password.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    if (password !== confirmPassword) return "Las contraseñas no coinciden";
    return null;
  };

  const handleSubmit = async () => {
    setError("");
    setShowError(false);
    const err = validate();
    if (err) {
      setError(err);
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }
    setLoading(true);
    const resp = await register({
      email,
      password,
      confirmPassword,
      fullName: fullName,
      username,
      phone: phone || undefined,
    });
    if (resp.success) {
      setSuccess(
        "Registro exitoso. Revisa tu correo para verificar la cuenta."
      );
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/check-email", { state: { email } });
      }, 1200);
    } else {
      setError(resp.error || "No se pudo registrar.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <Alert type="error" message={error} show={showError} />
      <Alert type="success" message={success} show={showSuccess} />
      <div className="register-window">
        <h2>Crear cuenta</h2>
        <RegisterForm
          fullName={fullName}
          setFullName={setFullName}
          username={username}
          setUsername={setUsername}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          handleSubmit={handleSubmit}
        />
        <button className="register-alt" onClick={() => navigate("/login")}>
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </div>
  );
}

export default RegisterWindow;
