import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { auth } from "../../firebase/config";
import type { ServiceResponse } from "../ServiceResponce.type";
import type { LoginPayload, LoginResponse } from "./types/Login.type";
import type { RecoverPasswordPayload } from "./types/RecoverPassword.type";
import type { RegisterPayload } from "./types/Register.type";

export const register = async (
  payload: RegisterPayload
): Promise<ServiceResponse<void>> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const err =
        (body &&
          (body.error || body.message || (body as any).error?.message)) ||
        "Error en el servidor";
      return { success: false, error: err };
    }

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Error de red" };
  }
};

// Firebase maneja la validación de tokens en el backend.
export const validateToken = async (
  token: string
): Promise<ServiceResponse<any>> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_URL}/auth/verify-token`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      // Si el backend devuelve 401 Unauthorized o 500
      throw new Error(
        `El backend falló la verificación (Status: ${response.status})`
      );
    }

    const data = await response.json();
    return { success: true, data: data.user }; // Devuelve los datos del usuario verificados
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Inicia sesión en el sistema usando Firebase Authentication.
 */
export const login = async (
  payload: LoginPayload
): Promise<ServiceResponse<LoginResponse>> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );
    const user = userCredential.user;
    const accessToken = await user.getIdToken();
    const refreshToken = user.refreshToken;
    const verificationResponse = await validateToken(accessToken);

    if (!verificationResponse.success) {
      throw new Error(
        verificationResponse.error || "Error en verificación del token."
      );
    }

    // construcción de nombres separados (firstName/lastName)
    const derivedDisplayName =
      user.displayName ||
      verificationResponse.data?.name ||
      user.email!.split("@")[0];

    const parts = derivedDisplayName.trim().split(/\s+/);
    const firstName = parts[0] || undefined;
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;

    return {
      success: true,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userDisplayName: derivedDisplayName,
        userEmail: payload.email,
        firstName,
        lastName,
      },
    };
  } catch (error: any) {
    // Mapeo más completo de códigos de error de Firebase para dar mensajes amigables
    let errorMessage = "Error desconocido al iniciar sesión.";
    const code = error?.code as string | undefined;

    switch (code) {
      case "auth/invalid-credential":
        // Ocurre cuando las credenciales están mal formadas (p. ej. OAuth mal generado)
        errorMessage = "Credenciales inválidas.";
        break;
      case "auth/user-disabled":
        errorMessage = "La cuenta está deshabilitada.";
        break;
      default:
        // Si el backend devolvió un mensaje lo usamos, si existe
        errorMessage = error?.message || "Error desconocido al iniciar sesión.";
        break;
    }

    return { success: false, error: errorMessage, errorCode: code };
  }
};

/**
 * Cierra la sesión del usuario en Firebase.
 */
export const logout = async (): Promise<ServiceResponse<void>> => {
  try {
    await signOut(auth);

    // Limpiar el almacenamiento local después del logout de Firebase
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); // Si lo usas
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al cerrar sesión.",
    };
  }
};

/**
 * Recupera la contraseña del usuario enviando un enlace al correo electrónico.
 * * @param {RecoverPasswordPayload} payload - Contiene el email del usuario.
 */
export const recoverPassword = async (
  payload: RecoverPasswordPayload
): Promise<ServiceResponse<void>> => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACK_URL}/auth/password/request`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMessage =
        body?.error || body?.message || "Error en el servidor";
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.message ??
        "Error de red al solicitar recuperación de contraseña.",
    };
  }
};

export const resetPassword = async (payload: {
  email: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<ServiceResponse<void>> => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACK_URL}/auth/password/reset`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = body?.error ?? body?.message ?? "Error en el servidor";
      return { success: false, error: err };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Error de red" };
  }
};

// --- Funciones no implementadas / no necesarias directamente por Firebase ---
export const validateRefreshToken = async (
  payload: any
): Promise<ServiceResponse<any>> => {
  // Firebase Auth maneja la expiración de sesión automáticamente (No usa refresh tokens explícitos)
  return {
    success: false,
    error: "Firebase maneja la sesión automáticamente.",
  };
};

export const updateName = async (
  token: string,
  payload: any
): Promise<ServiceResponse<void>> => {
  // La actualización del nombre debe ser una llamada a la API de Nest.js para modificar MongoDB.
  return {
    success: false,
    error: "Usar API de Backend para actualizar perfil de MongoDB.",
  };
};

export const changePassword = async (
  token: string,
  payload: any
): Promise<ServiceResponse<void>> => {
  // Usar el método updatePassword de Firebase en el frontend, NO en el service.
  return {
    success: false,
    error: "Usar updatePassword de Firebase en el componente.",
  };
};

export const getUsers = async (
  token: string
): Promise<ServiceResponse<any[]>> => {
  // Esto es una llamada al backend de Nest.js (futura Tarea D4) para obtener usuarios de MongoDB.
  return { success: false, error: "Llamada a la API de Backend (Nest.js)." };
};
