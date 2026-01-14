/**
 * DTOs (Data Transfer Objects) para Productos
 *
 * Define las interfaces TypeScript estrictas para
 * las peticiones y respuestas de la API de productos.
 */

/**
 * Producto - Entidad principal
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO para crear un nuevo producto
 * Omite campos generados automáticamente (id, timestamps)
 */
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  featured?: boolean;
}

/**
 * DTO para actualizar un producto existente
 * Todos los campos son opcionales (actualización parcial)
 */
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  stock?: number;
  featured?: boolean;
}

/**
 * Parámetros de búsqueda/filtrado de productos
 */
export interface ProductSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Respuesta de la API para un solo producto
 */
export interface ProductResponse {
  success: boolean;
  data: Product;
  message?: string;
}

/**
 * Respuesta de la API para lista de productos
 */
export interface ProductListResponse {
  success: boolean;
  data: Product[];
  meta: ProductPaginationMeta;
}

/**
 * Metadata de paginación
 */
export interface ProductPaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Respuesta para subida de imagen
 */
export interface ProductImageUploadResponse {
  success: boolean;
  data: {
    imageUrl: string;
    fileName: string;
    fileSize: number;
  };
  message?: string;
}

/**
 * Categorías disponibles de productos
 */
export type ProductCategory =
  | 'Kits Educativos'
  | 'Figuras'
  | 'Puzzles'
  | 'Libros'
  | 'Peluches'
  | 'Juegos'
  | 'Accesorios';

/**
 * Constantes de categorías para uso en formularios
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Kits Educativos',
  'Figuras',
  'Puzzles',
  'Libros',
  'Peluches',
  'Juegos',
  'Accesorios',
];
