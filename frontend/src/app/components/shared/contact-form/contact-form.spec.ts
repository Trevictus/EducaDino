import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContactForm } from './contact-form';
import { ToastService } from '../../../shared/services/toast';

/**
 * Tests para ContactForm Component
 *
 * FASE 7 - Testing (RA 7.2):
 * ─────────────────────────
 * ✅ Tests de formulario reactivo
 * ✅ Tests de validaciones
 * ✅ Tests de envío de formulario
 * ✅ Tests de mensajes de error
 */
describe('ContactForm', () => {
  let component: ContactForm;
  let fixture: ComponentFixture<ContactForm>;
  let toastServiceMock: {
    success: ReturnType<typeof vi.fn>;
    warning: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    toastServiceMock = {
      success: vi.fn(),
      warning: vi.fn(),
      error: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ContactForm, ReactiveFormsModule],
      providers: [
        { provide: ToastService, useValue: toastServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CREACIÓN
  // ══════════════════════════════════════════════════════════════════

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on creation', () => {
    expect(component.contactForm).toBeDefined();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE ESTRUCTURA DEL FORMULARIO
  // ══════════════════════════════════════════════════════════════════

  describe('Form Structure', () => {
    it('should have nombre field', () => {
      expect(component.contactForm.get('nombre')).toBeTruthy();
    });

    it('should have email field', () => {
      expect(component.contactForm.get('email')).toBeTruthy();
    });

    it('should have asunto field', () => {
      expect(component.contactForm.get('asunto')).toBeTruthy();
    });

    it('should have mensaje field', () => {
      expect(component.contactForm.get('mensaje')).toBeTruthy();
    });

    it('should start with empty form values', () => {
      expect(component.contactForm.get('nombre')?.value).toBe('');
      expect(component.contactForm.get('email')?.value).toBe('');
      expect(component.contactForm.get('mensaje')?.value).toBe('');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE VALIDACIÓN - NOMBRE
  // ══════════════════════════════════════════════════════════════════

  describe('Nombre Validation', () => {
    it('should be required', () => {
      const nombreControl = component.contactForm.get('nombre');
      nombreControl?.setValue('');
      expect(nombreControl?.hasError('required')).toBe(true);
    });

    it('should require minimum 3 characters', () => {
      const nombreControl = component.contactForm.get('nombre');
      nombreControl?.setValue('ab');
      expect(nombreControl?.hasError('minlength')).toBe(true);
    });

    it('should accept valid name', () => {
      const nombreControl = component.contactForm.get('nombre');
      nombreControl?.setValue('Juan Pérez');
      expect(nombreControl?.valid).toBe(true);
    });

    it('should reject names longer than 50 characters', () => {
      const nombreControl = component.contactForm.get('nombre');
      nombreControl?.setValue('a'.repeat(51));
      expect(nombreControl?.hasError('maxlength')).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE VALIDACIÓN - EMAIL
  // ══════════════════════════════════════════════════════════════════

  describe('Email Validation', () => {
    it('should be required', () => {
      const emailControl = component.contactForm.get('email');
      emailControl?.setValue('');
      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.contactForm.get('email');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should accept valid email', () => {
      const emailControl = component.contactForm.get('email');
      emailControl?.setValue('test@example.com');
      expect(emailControl?.valid).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE VALIDACIÓN - MENSAJE
  // ══════════════════════════════════════════════════════════════════

  describe('Mensaje Validation', () => {
    it('should be required', () => {
      const mensajeControl = component.contactForm.get('mensaje');
      mensajeControl?.setValue('');
      expect(mensajeControl?.hasError('required')).toBe(true);
    });

    it('should require minimum 10 characters', () => {
      const mensajeControl = component.contactForm.get('mensaje');
      mensajeControl?.setValue('Hola');
      expect(mensajeControl?.hasError('minlength')).toBe(true);
    });

    it('should accept valid message', () => {
      const mensajeControl = component.contactForm.get('mensaje');
      mensajeControl?.setValue('Este es un mensaje válido con suficientes caracteres');
      expect(mensajeControl?.valid).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE VALIDACIÓN - ASUNTO (OPCIONAL)
  // ══════════════════════════════════════════════════════════════════

  describe('Asunto Validation', () => {
    it('should not be required', () => {
      const asuntoControl = component.contactForm.get('asunto');
      asuntoControl?.setValue('');
      expect(asuntoControl?.hasError('required')).toBe(false);
    });

    it('should allow empty value', () => {
      const asuntoControl = component.contactForm.get('asunto');
      asuntoControl?.setValue('');
      expect(asuntoControl?.valid).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE ENVÍO DEL FORMULARIO
  // ══════════════════════════════════════════════════════════════════

  describe('Form Submission', () => {
    it('should not submit if form is invalid', () => {
      component.onSubmit();
      expect(toastServiceMock.warning).toHaveBeenCalledWith(
        'Por favor, corrige los errores del formulario'
      );
    });

    it('should mark all fields as touched on submit', () => {
      component.onSubmit();
      expect(component.contactForm.get('nombre')?.touched).toBe(true);
      expect(component.contactForm.get('email')?.touched).toBe(true);
      expect(component.contactForm.get('mensaje')?.touched).toBe(true);
    });

    it('should set isSubmitting to true during submission', async () => {
      // Llenar formulario válido
      component.contactForm.patchValue({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        mensaje: 'Este es un mensaje de prueba válido'
      });

      component.onSubmit();
      expect(component.isSubmitting).toBe(true);
    });

    it('should reset form after successful submission', async () => {
      component.contactForm.patchValue({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        mensaje: 'Este es un mensaje de prueba válido'
      });

      component.onSubmit();

      // Esperar el setTimeout del componente
      await new Promise(resolve => setTimeout(resolve, 1100));

      expect(component.contactForm.get('nombre')?.value).toBeNull();
      expect(component.isSubmitting).toBe(false);
    });

    it('should show success toast after submission', async () => {
      component.contactForm.patchValue({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        mensaje: 'Este es un mensaje de prueba válido'
      });

      component.onSubmit();
      await new Promise(resolve => setTimeout(resolve, 1100));

      expect(toastServiceMock.success).toHaveBeenCalledWith(
        '¡Mensaje enviado correctamente!',
        'Éxito'
      );
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE HELPER METHODS
  // ══════════════════════════════════════════════════════════════════

  describe('Helper Methods', () => {
    it('should return controls via f getter', () => {
      expect(component.f).toBe(component.contactForm.controls);
    });

    it('should detect error on touched invalid field', () => {
      const nombreControl = component.contactForm.get('nombre');
      nombreControl?.setValue('');
      nombreControl?.markAsTouched();

      expect(component.hasError('nombre')).toBe(true);
    });

    it('should not detect error on valid field', () => {
      const nombreControl = component.contactForm.get('nombre');
      nombreControl?.setValue('Juan Pérez');
      nombreControl?.markAsTouched();

      expect(component.hasError('nombre')).toBe(false);
    });

    it('should not detect error on untouched invalid field', () => {
      const nombreControl = component.contactForm.get('nombre');
      nombreControl?.setValue('');
      // No marked as touched

      expect(component.hasError('nombre')).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE ESTADO
  // ══════════════════════════════════════════════════════════════════

  describe('State Management', () => {
    it('should initialize isSubmitting as false', () => {
      expect(component.isSubmitting).toBe(false);
    });

    it('should have invalid form initially', () => {
      expect(component.contactForm.valid).toBe(false);
    });

    it('should have valid form when all required fields are filled', () => {
      component.contactForm.patchValue({
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        mensaje: 'Este es un mensaje de prueba válido'
      });

      expect(component.contactForm.valid).toBe(true);
    });
  });
});
