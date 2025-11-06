import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registerWindow.css";
import { Alert } from "../../commons/Alert";
import { register } from "../../services/auth/auth.service";

function RegisterWindow() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();

  const validateFields = (opts?: { only?: keyof typeof fieldErrors }) => {
    const target = opts?.only;
    const next: typeof fieldErrors = { ...fieldErrors };

    const setErr = (k: keyof typeof fieldErrors, msg: string | undefined) => {
      if (target && k !== target) return;
      if (msg) next[k] = msg; else delete next[k];
    };
    setErr("firstName",
      firstName.trim().length === 0
        ? "Nombre requerido"
        : firstName.trim().length < 2
          ? "Mínimo 2 caracteres"
          : undefined
    );
    setErr("lastName",
      lastName.trim().length === 0
        ? "Apellido requerido"
        : lastName.trim().length < 2
          ? "Mínimo 2 caracteres"
          : undefined
    );
    setErr("email",
      email.trim().length === 0
        ? "Email requerido"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Formato de email inválido"
          : undefined
    );
    setErr("password",
      password.length === 0
        ? "Contraseña requerida"
        : password.length < 8
          ? "Mínimo 8 caracteres"
          : password.length > 20
            ? "Máximo 20 caracteres"
            : !/[A-Za-z]/.test(password)
              ? "Debe incluir una letra"
              : !/\d/.test(password)
                ? "Debe incluir un número"
                : undefined
    );
    setErr("confirmPassword",
      confirmPassword.length === 0
        ? "Confirmación requerida"
        : confirmPassword !== password
          ? "No coincide con la contraseña"
          : undefined
    );

    setFieldErrors(next);
    return next;
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setShowError(false);
    setShowSuccess(false);

    const errs = validateFields();
    if (Object.keys(errs).length) {
      setError("Revise los campos marcados.");
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }

    setLoading(true);
    const resp = await register({ firstName, lastName, email, password, confirmPassword });
    if (resp.success) {
      setSuccess("Registro exitoso. Redirigiendo...");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate("/login");
      }, 2000);
    } else {
      setError(resp.error || "No se pudo registrar.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
    setLoading(false);
  };

  const allFilled = firstName && lastName && email && password && confirmPassword;
  const hasErrors = Object.keys(fieldErrors).length > 0;

  return (
    <div className="register-page">
      {/* Mantener alertas globales */}
      <Alert type="error" message={error} show={showError} />
      <Alert type="success" message={success} show={showSuccess} />
      <div className="register-window">
        <h2>Crear cuenta</h2>
        <div className="register-form">
          <input
            className="register-input"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); validateFields({ only: "firstName" }); }}
            onBlur={() => validateFields({ only: "firstName" })}
          />
          {fieldErrors.firstName && <div className="register-error">{fieldErrors.firstName}</div>}
          <input
            className="register-input"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); validateFields({ only: "lastName" }); }}
            onBlur={() => validateFields({ only: "lastName" })}
          />
          {fieldErrors.lastName && <div className="register-error">{fieldErrors.lastName}</div>}
          <input
            className="register-input"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); validateFields({ only: "email" }); }}
            onBlur={() => validateFields({ only: "email" })}
            type="email"
          />
            {fieldErrors.email && <div className="register-error">{fieldErrors.email}</div>}
          <input
            className="register-input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => { setPassword(e.target.value); validateFields({ only: "password" }); }}
            onBlur={() => validateFields({ only: "password" })}
            type="password"
          />
          {fieldErrors.password && <div className="register-error">{fieldErrors.password}</div>}
          <input
            className="register-input"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); validateFields({ only: "confirmPassword" }); }}
            onBlur={() => validateFields({ only: "confirmPassword" })}
            type="password"
          />
          {fieldErrors.confirmPassword && <div className="register-error">{fieldErrors.confirmPassword}</div>}
          <button
            className="register-submit"
            onClick={handleSubmit}
            disabled={loading || !allFilled || hasErrors}
          >
            {loading ? (
              <span className="register-spinner">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </span>
            ) : "Registrarse"}
          </button>
          <button
            className="register-alt"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}
export default RegisterWindow;