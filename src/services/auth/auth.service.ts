import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { auth } from "../../firebase/config";
import type { ServiceResponse } from "../ServiceResponce.type";
import type { LoginPayload, LoginResponse } from "./types/Login.type";
import type { RecoverPasswordPayload } from "./types/RecoverPassword.type";
import type { RegisterPayload } from "./types/Register.type";
import { parseApiResponse } from "../api/parseApiResponse";

export const register = async (
  payload: RegisterPayload
): Promise<ServiceResponse<void>> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const parsed = await parseApiResponse(res);
    if (!parsed.ok) {
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.errorCode || undefined,
      };
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
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const parsed = await parseApiResponse(response);
    if (!parsed.ok) {
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.errorCode || undefined,
      };
    }

    // backend returns { user: {...} } or user inside body
    const user = parsed.body?.user ?? parsed.body;
    return { success: true, data: user };
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
    // If the user's email is not verified, sign out and return an actionable error
    if (!user.emailVerified) {
      try {
        await signOut(auth);
      } catch (e) {
        // ignore sign out errors
      }
      return {
        success: false,
        error: "El correo electrónico no ha sido verificado.",
        errorCode: "email-not-verified",
      };
    }
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
        emailVerified: user.emailVerified,
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
 * Pide al backend que genere y envíe un correo de verificación para el email dado.
 */
export const sendVerificationEmail = async (
  email: string
): Promise<ServiceResponse<void>> => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACK_URL}/auth/verify-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const parsed = await parseApiResponse(res);
    if (!parsed.ok) {
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.errorCode || undefined,
      };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Error de red" };
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

    const parsed = await parseApiResponse(res);
    if (!parsed.ok)
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.errorCode || undefined,
      };
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

/**
 * Solicita al backend la configuración de 2FA (TOTP) y devuelve los datos necesarios
 * para mostrar el QR o la URL otpauth. Se espera que el backend devuelva
 * { otpauthUrl?: string, qrBase64?: string, secret?: string }
 */
export const request2faSetup = async (): Promise<
  ServiceResponse<{ otpauthUrl?: string; qrBase64?: string; secret?: string }>
> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACK_URL}/auth/2fa/setup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const parsed = await parseApiResponse(res);
    if (!parsed.ok)
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.errorCode || undefined,
      };

    return { success: true, data: parsed.body };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Error de red" };
  }
};

/**
 * Confirma la activación de 2FA enviando el código TOTP generado por el usuario.
 * Se espera que el backend valide y active 2FA para la cuenta.
 */
export const confirm2fa = async (
  code: string
): Promise<ServiceResponse<void>> => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACK_URL}/auth/2fa/confirm`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }
    );

    const parsed = await parseApiResponse(res);
    if (!parsed.ok)
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.errorCode || undefined,
      };

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Error de red" };
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

    const parsed = await parseApiResponse(res);
    if (!parsed.ok)
      return {
        success: false,
        error: parsed.message,
        errorCode: parsed.errorCode || undefined,
      };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Error de red" };
  }
};

// --- Funciones no implementadas / no necesarias directamente por Firebase ---
export const validateRefreshToken = async (
  _payload: any
): Promise<ServiceResponse<any>> => {
  // Firebase Auth maneja la expiración de sesión automáticamente (No usa refresh tokens explícitos)
  return {
    success: false,
    error: "Firebase maneja la sesión automáticamente.",
  };
};

export const updateName = async (
  _token: string,
  _payload: any
): Promise<ServiceResponse<void>> => {
  // La actualización del nombre debe ser una llamada a la API de Nest.js para modificar MongoDB.
  return {
    success: false,
    error: "Usar API de Backend para actualizar perfil de MongoDB.",
  };
};

export const changePassword = async (
  _token: string,
  _payload: any
): Promise<ServiceResponse<void>> => {
  // Usar el método updatePassword de Firebase en el frontend, NO en el service.
  return {
    success: false,
    error: "Usar updatePassword de Firebase en el componente.",
  };
};

export const getUsers = async (
  _token: string
): Promise<ServiceResponse<any[]>> => {
  // Esto es una llamada al backend de Nest.js (futura Tarea D4) para obtener usuarios de MongoDB.
  return { success: false, error: "Llamada a la API de Backend (Nest.js)." };
};
