//import axiosInstance from "../AxiosInstance";
import type { ServiceResponse } from "../ServiceResponce.type";
import type { ChangePasswordPayload } from "./types/ChangePassword.type";
import type { GetUsersResponse } from "./types/GetUsers.type";
import type { LoginPayload, LoginResponse } from "./types/Login.type";
import type { RecoverPasswordPayload } from "./types/RecoverPassword.type";
import type { RegisterPayload } from "./types/Register.type";
import type { ResetPasswordPayload } from "./types/ResetPassword.type";
import type { UpdateNamePayload } from "./types/UpdateName.type";
import type { ValidateAccessTokenResponse } from "./types/ValidateAccessToken.type";
import type { ValidateRefreshTokenPayload, ValidateRefreshTokenResponse } from "./types/ValidateRefreshToken.type";

/**
 * @description
 * Este archivo contiene funciones para interactuar con la API de autenticación.
 * Las funciones permiten registrar, iniciar sesión, validar tokens,
 * recuperar y restablecer contraseñas, y actualizar el nombre del usuario.
 */

/**
 * Registra un nuevo usuario en el sistema.
 * 
 * @param {RegisterPayload} payload - La carga útil que contiene la información del nuevo usuario.
 */
export const register = async ( payload: RegisterPayload): Promise<ServiceResponse<void>> => {
  // try {
  //   await axiosInstance.post('/auth/register', payload, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return { success: true };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Register payload:', payload);
  return { success: true };
};

/**
 * Inicia sesión en el sistema.
 * 
 * @param {LoginPayload} payload - La carga útil que contiene la información de inicio de sesión.
 */
export const login = async (payload: LoginPayload): Promise<ServiceResponse<LoginResponse>> => {
  // try {
  //   const response = await axiosInstance.patch('/auth/login', payload);
  //   return { success: true, data: response.data as LoginResponse };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Login payload:', payload);
  return { success: true, data: { accessToken: 'dummyAccessToken', refreshToken: 'dummyRefreshToken', firstName: 'John', lastName: 'Doe' } };
};

/**
 * Valida el token de acceso.
 * 
 * @param {string} token - El token de acceso a validar.
 */
export const validateToken = async (token: string): Promise<ServiceResponse<ValidateAccessTokenResponse>> => {
  // try {
  //   const response = await axiosInstance.get('/auth/validate-token', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return { 
  //     success: true, data: response.data as ValidateAccessTokenResponse };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Validating token:', token);
  return { success: true, data: { expiresAt: new Date(Date.now() + 3600 * 1000) } };
};

/**
 * Valida el token de actualización.
 * 
 * @param {ValidateRefreshTokenPayload} payload - La carga útil que contiene el token de actualización a validar.
 */
export const validateRefreshToken = async (payload: ValidateRefreshTokenPayload): Promise<ServiceResponse<ValidateRefreshTokenResponse>> => {
  // try {
  //   const response = await axiosInstance.patch('/auth/refresh-token', payload);
  //   return { success: true, data: response.data as ValidateRefreshTokenResponse };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Validating refresh token:', payload.refreshToken);
  return { success: true, data: { accessToken: 'newDummyAccessToken', refreshToken: 'newDummyRefreshToken' } };
}

/**
 * Recupera la contraseña del usuario.
 * 
 * @param {RecoverPasswordPayload} payload - La carga útil que contiene la información para recuperar la contraseña.
 */
export const recoverPassword = async (payload: RecoverPasswordPayload): Promise<ServiceResponse<void>> => {
  // try {
  //   await axiosInstance.patch('/auth/request-password-reset', payload);
  //   return { success: true };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Recover password payload:', payload);
  return { success: true };
};

/**
 * Restablece la contraseña del usuario.
 * 
 * @param {ResetPasswordPayload} payload - La carga útil que contiene la información para restablecer la contraseña.
 */
export const resetPassword = async (payload: ResetPasswordPayload): Promise<ServiceResponse<void>> => {
  // try {
  //   await axiosInstance.patch('/auth/reset-password', payload);
  //   return { success: true };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Reset password payload:', payload);
  return { success: true };
};

/**
 * Verifica el código de recuperación de contraseña.
 * 
 * @param {string} token - El token de autorización del usuario.
 */
export const logout = async (token: string): Promise<ServiceResponse<void>> => {
  // try {
  //   await axiosInstance.patch('/auth/logout', {}, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return { success: true };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Logging out with token:', token);
  return { success: true };
};

/**
 * Actualiza el nombre del usuario.
 * 
 * @param {string} token - El token de autorización del usuario.
 * @param {UpdateNamePayload} payload - La carga útil que contiene la información para actualizar el nombre.
 */
export const updateName = async (token: string, payload: UpdateNamePayload): Promise<ServiceResponse<void>> => {
  // try {
  //   await axiosInstance.patch('/auth/update-name', payload, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return { success: true };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Updating name for token:', token);
  console.log('Update name payload:', payload);
  return { success: true };
};

/**
 * Cambia la contraseña del usuario.
 * 
 * @param {string} token - El token de autorización del usuario.
 * @param {ChangePasswordPayload} payload - La carga útil que contiene la información para cambiar la contraseña.
 */
export const changePassword = async (token: string, payload: ChangePasswordPayload): Promise<ServiceResponse<void>> => {
  // try {
  //   await axiosInstance.patch('/auth/change-password', payload, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return { success: true };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Change password token:', token);
  console.log('Change password payload:', payload);
  return { success: true };
};

/** * Obtiene la lista de usuarios.
 * 
 * @param {string} token - El token de autorización del usuario.
 */
export const getUsers = async (token: string): Promise<ServiceResponse<GetUsersResponse[]>> => {
  // try {
  //   const response = await axiosInstance.get('/auth/get-users', {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   return { success: true, data: response.data as GetUsersResponse[] };
  // } catch (error) {
  //   return { success: false, error: String(error) };
  // }
  console.log('Getting users with token:', token);
  return { success: true, data: [
    { _id: '1', firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' },
    { _id: '2', firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com' },
  ] };
};
