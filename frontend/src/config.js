/**
 * API base URL configuration
 * - Development: empty string (Vite proxy handles /api → localhost:8000)
 * - Production: set VITE_API_URL env var to the backend URL (e.g. https://xxx.onrender.com)
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || ''
