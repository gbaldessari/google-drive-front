import type { JSX } from "react";

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  loading: boolean;
  handleSubmit: () => void;
}): JSX.Element {
  return (
    <div className="login-form">
      <input className="login-form-input"
        type="text"
        value={email}
        placeholder="Ingrese su email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input className="login-form-input"
        type="password"
        value={password}
        placeholder="Ingrese su contraseña"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className={`login-submit-button ${loading ? "loading" : ""}`}
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
          "Iniciar Sesión"
        )}
      </button>
    </div>
  );
}