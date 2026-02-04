/**
 * Barrel export para servicios del core
 */

// API Base
export { ApiService } from './api.service';
export type { ApiRequestOptions, PaginatedResponse, ApiResponse } from './api.service';

// Autenticación
export { AuthService } from './auth.service';
export type {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  AuthResponse,
  UserProfile,
} from './auth.service';

// Carrito
export { CartService } from './cart.service';
export type { CartItem, Cart, AddToCartRequest } from './cart.service';

// Progreso de Minijuegos
export { ProgressService } from './progress.service';
export type { SaveProgressRequest, UserProgress, ProgressStats } from './progress.service';

// Dinosaurios
export { DinosaurService } from './dinosaur.service';
export type { Dinosaur, DinosaurRequest } from './dinosaur.service';

