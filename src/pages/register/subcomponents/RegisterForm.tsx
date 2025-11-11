import type { JSX } from "react";

/**
 * Formulario de registro reutilizable.
 * Propiedades y tipos están alineados con el DTO del backend.
 */
export function RegisterForm({
  fullName,
  setFullName,
  username,
  setUsername,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  handleSubmit,
}: {
  fullName: string;
  setFullName: (v: string) => void;
  username: string;
  setUsername: (v: string) => void;
  phone?: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  loading: boolean;
  handleSubmit: () => void;
}): JSX.Element {
  return (
    <div className="register-form">
      <input
        className="register-form-input"
        type="text"
        value={fullName}
        placeholder="Nombre completo"
        onChange={(e) => setFullName(e.target.value)}
      />

      <div className="row-two">
        <input
          className="register-form-input"
          type="text"
          value={username}
          placeholder="Nombre de usuario"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="register-form-input"
          type="text"
          value={phone}
          placeholder="Teléfono (opcional)"
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <input
        className="register-form-input"
        type="text"
        value={email}
        placeholder="Correo electrónico"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="register-form-input"
        type="password"
        value={password}
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="register-form-input"
        type="password"
        value={confirmPassword}
        placeholder="Confirmar contraseña"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        className={`register-submit-button ${loading ? "loading" : ""}`}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <div className="login-spinner">
            <div className="login-dot"></div>
            <div className="login-dot"></div>
            <div className="login-dot"></div>
          </div>
        ) : (
          "Registrarme"
        )}
      </button>
    </div>
  );
}
