import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

// Servicios
import { ToastService } from '../../../shared/services/toast';

/**
 * Interfaz para un item del pedido
 */
export interface OrderItem {
  producto: string;
  cantidad: number;
  precio: number;
}

/**
 * TAREA 4: OrderForm con FormArray
 *
 * Demuestra el uso de FormArray para contenido dinámico:
 * - Añadir/eliminar items
 * - Validaciones por item
 * - Cálculo de precio total reactivo
 */
@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss'
})
export class OrderForm implements OnInit {
  // Inyección de dependencias
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  // FormGroup principal
  orderForm!: FormGroup;

  // Estado de envío
  isSubmitting = false;

  // Productos disponibles (simulación)
  readonly availableProducts = [
    { id: 'trex-figure', name: 'Figura T-Rex', price: 29.99 },
    { id: 'velociraptor-figure', name: 'Figura Velociraptor', price: 24.99 },
    { id: 'triceratops-figure', name: 'Figura Triceratops', price: 27.99 },
    { id: 'dino-book', name: 'Libro de Dinosaurios', price: 19.99 },
    { id: 'fossil-kit', name: 'Kit de Excavación', price: 34.99 },
    { id: 'dino-puzzle', name: 'Puzzle Jurásico', price: 14.99 }
  ];

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario con FormBuilder
   */
  private initForm(): void {
    this.orderForm = this.fb.group({
      // Datos del cliente
      nombreCliente: ['', [Validators.required, Validators.minLength(3)]],
      emailCliente: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(10)]],

      // FormArray de items
      items: this.fb.array([], [Validators.required, Validators.minLength(1)]),

      // Notas adicionales
      notas: ['']
    });

    // Añadir un item inicial
    this.addItem();
  }

  /**
   * Getter para acceder al FormArray de items
   */
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  /**
   * Crea un nuevo FormGroup para un item
   */
  private createItemFormGroup(): FormGroup {
    return this.fb.group({
      producto: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1), Validators.max(99)]],
      precio: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  /**
   * Añade un nuevo item al FormArray
   */
  addItem(): void {
    this.items.push(this.createItemFormGroup());
  }

  /**
   * Elimina un item del FormArray por índice
   */
  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.toastService.info('Item eliminado');
    } else {
      this.toastService.warning('Debe haber al menos un item en el pedido');
    }
  }

  /**
   * Actualiza el precio cuando se selecciona un producto
   */
  onProductChange(index: number): void {
    const itemGroup = this.items.at(index) as FormGroup;
    const selectedProductId = itemGroup.get('producto')?.value;

    const product = this.availableProducts.find(p => p.id === selectedProductId);
    if (product) {
      itemGroup.patchValue({ precio: product.price });
    }
  }

  /**
   * Calcula el subtotal de un item
   */
  getItemSubtotal(index: number): number {
    const item = this.items.at(index);
    const cantidad = item.get('cantidad')?.value || 0;
    const precio = item.get('precio')?.value || 0;
    return cantidad * precio;
  }

  /**
   * Calcula el precio total del pedido
   */
  get totalPrice(): number {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.getItemSubtotal(i);
    }
    return total;
  }

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    this.orderForm.markAllAsTouched();

    if (this.orderForm.invalid) {
      this.toastService.warning('Por favor, corrige los errores del formulario');
      return;
    }

    if (this.items.length === 0) {
      this.toastService.error('Añade al menos un item al pedido');
      return;
    }

    this.isSubmitting = true;

    // Simular envío
    setTimeout(() => {
      console.log('Pedido enviado:', this.orderForm.value);
      this.toastService.success(`¡Pedido realizado! Total: ${this.totalPrice.toFixed(2)}€`, 'Éxito');
      this.orderForm.reset();
      this.items.clear();
      this.addItem();
      this.isSubmitting = false;
    }, 1500);
  }

  /**
   * Helpers
   */
  get f() {
    return this.orderForm.controls;
  }

  hasError(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  hasItemError(index: number, fieldName: string): boolean {
    const item = this.items.at(index);
    const field = item.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.orderForm.get(fieldName);
    if (!field?.errors) return '';

    if (field.errors['required']) return 'Este campo es obligatorio';
    if (field.errors['email']) return 'Introduce un email válido';
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    if (field.errors['min']) {
      return `El valor mínimo es ${field.errors['min'].min}`;
    }

    return 'Campo inválido';
  }
}
