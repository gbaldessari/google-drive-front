import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registerWindow.css";
import { register } from "../../services/auth/auth.service";
import { z } from "zod";
import { Alert } from "../../commons/Alert";
import { RegisterForm } from "./subcomponents/RegisterForm";

// Validaciones alineadas con RegisterUserDto
const emailSchema = z
  .string()
  .email("Por favor, ingrese un correo electrónico válido.");
const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.");
const fullNameSchema = z.string().min(1, "El nombre completo es obligatorio.");
const usernameSchema = z
  .string()
  .min(3, "El nombre de usuario debe tener entre 3 y 30 caracteres.")
  .max(30, "El nombre de usuario debe tener entre 3 y 30 caracteres.");
const phoneSchema = z.string().optional();

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

  const handleSubmit = async () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      fullNameSchema.parse(fullName);
      usernameSchema.parse(username);
      phoneSchema.parse(phone);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.issues?.[0]?.message || "Datos inválidos.");
      } else {
        setError("Datos inválidos.");
      }
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setLoading(true);
    setShowError(false);

    const response = await register({
      email,
      password,
      confirmPassword,
      fullName,
      username,
      phone: phone || undefined,
    });

    if (response.success) {
      setSuccess("Registro exitoso. Redirigiendo al login...");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/login");
        setLoading(false);
      }, 2000);
    } else {
      setError(response.error || "Error al registrarse.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      setLoading(false);
    }
  };

  return (
    <div>
      <Alert type="error" message={error} show={showError} />
      <Alert type="success" message={success} show={showSuccess} />
      <img src="assets/LOGO2.png" alt="Logo" className="logo" />
      <div className="register-window">
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
        <button className="recover-password" onClick={() => navigate("/login")}>
          Volver al login
        </button>
      </div>
    </div>
  );
}

export default RegisterWindow;
