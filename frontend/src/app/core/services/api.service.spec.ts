import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

/**
 * Tests para ApiService
 *
 * FASE 7 - Testing (RA 7.2):
 * ─────────────────────────
 * ✅ Tests unitarios con HttpTestingController
 * ✅ Mock de peticiones HTTP
 * ✅ Verificación de métodos CRUD
 * ✅ Manejo de errores
 */
describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verificar que no hay peticiones pendientes
    httpMock.verify();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CREACIÓN
  // ══════════════════════════════════════════════════════════════════

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE GET
  // ══════════════════════════════════════════════════════════════════

  describe('get()', () => {
    it('should perform GET request to correct URL', () => {
      const mockData = [{ id: '1', name: 'Test Product' }];

      service.get<typeof mockData>('/products').subscribe(data => {
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockData);
    });

    it('should include query params when provided', () => {
      service.get('/products', {
        params: { category: 'toys', page: 1 }
      }).subscribe();

      const req = httpMock.expectOne(r =>
        r.url === `${baseUrl}/products` &&
        r.params.get('category') === 'toys' &&
        r.params.get('page') === '1'
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle array params correctly', () => {
      service.get('/products', {
        params: { tags: ['a', 'b', 'c'] }
      }).subscribe();

      const req = httpMock.expectOne(r => r.url === `${baseUrl}/products`);
      expect(req.request.params.getAll('tags')).toEqual(['a', 'b', 'c']);
      req.flush([]);
    });

    it('should handle GET errors', () => {
      const errorMessage = 'Server error';

      service.get('/products').subscribe({
        next: () => { throw new Error('Should have failed'); },
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE POST
  // ══════════════════════════════════════════════════════════════════

  describe('post()', () => {
    it('should perform POST request with body', () => {
      const newProduct = { name: 'New Product', price: 29.99 };
      const mockResponse = { id: '123', ...newProduct };

      service.post<typeof mockResponse>('/products', newProduct).subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(mockResponse);
    });

    it('should handle POST errors', () => {
      service.post('/products', { name: 'Test' }).subscribe({
        next: () => { throw new Error('Should have failed'); },
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/products`);
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE PUT
  // ══════════════════════════════════════════════════════════════════

  describe('put()', () => {
    it('should perform PUT request with body', () => {
      const updatedProduct = { id: '123', name: 'Updated Product', price: 34.99 };

      service.put<typeof updatedProduct>('/products/123', updatedProduct).subscribe(data => {
        expect(data).toEqual(updatedProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/products/123`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(updatedProduct);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE PATCH
  // ══════════════════════════════════════════════════════════════════

  describe('patch()', () => {
    it('should perform PATCH request with partial body', () => {
      const partialUpdate = { price: 39.99 };
      const mockResponse = { id: '123', name: 'Product', price: 39.99 };

      service.patch<typeof mockResponse>('/products/123', partialUpdate).subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/products/123`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(partialUpdate);
      req.flush(mockResponse);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE DELETE
  // ══════════════════════════════════════════════════════════════════

  describe('delete()', () => {
    it('should perform DELETE request', () => {
      service.delete('/products/123').subscribe();

      const req = httpMock.expectOne(`${baseUrl}/products/123`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle 404 on DELETE', () => {
      service.delete('/products/999').subscribe({
        next: () => { throw new Error('Should have failed'); },
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/products/999`);
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE UPLOAD
  // ══════════════════════════════════════════════════════════════════

  describe('uploadFile()', () => {
    it('should upload file using FormData', () => {
      const mockFile = new File(['test content'], 'test.png', { type: 'image/png' });
      const mockResponse = { success: true, imageUrl: '/images/test.png' };

      service.uploadFile<typeof mockResponse>('/upload', mockFile, 'image').subscribe(data => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      req.flush(mockResponse);
    });

    it('should include additional data in FormData', () => {
      const mockFile = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
      const additionalData = { productId: '123' };

      service.uploadFile('/upload', mockFile, 'file', additionalData).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/upload`);
      const formData = req.request.body as FormData;
      expect(formData.get('productId')).toBe('123');
      req.flush({ success: true });
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE URL BUILDING
  // ══════════════════════════════════════════════════════════════════

  describe('URL building', () => {
    it('should handle endpoints without leading slash', () => {
      service.get('products').subscribe();

      const req = httpMock.expectOne(`${baseUrl}/products`);
      expect(req.request.url).toBe(`${baseUrl}/products`);
      req.flush([]);
    });

    it('should handle endpoints with leading slash', () => {
      service.get('/products').subscribe();

      const req = httpMock.expectOne(`${baseUrl}/products`);
      expect(req.request.url).toBe(`${baseUrl}/products`);
      req.flush([]);
    });
  });
});
