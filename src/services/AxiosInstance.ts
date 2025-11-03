import axios from 'axios';

/**
 * Instancia de Axios configurada para la aplicación.
 *
 * @remarks
 * - Usa la URL base definida en las variables de entorno (`VITE_BACK_URL`).
 * - Establece el header 'Content-Type' a 'application/json' para todas las peticiones.
 * - Utiliza esta instancia para realizar llamadas a la API en toda la aplicación.
 */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Instancia de Axios configurada para manejar cargas de archivos.
 *
 * @remarks
 * - Usa la URL base definida en las variables de entorno (`VITE_BACK_URL`).
 * - Establece el header 'Content-Type' a 'multipart/form-data' para todas las peticiones.
 * - Utiliza esta instancia para realizar llamadas a la API en toda la aplicación.
 */
export const axiosFilesInstance = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
