import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { CanComponentDeactivate } from '../../../guards/pending-changes.guard';

/**
 * ProductFormComponent - Formulario para crear/editar productos.
 *
 * Implementa CanComponentDeactivate para proteger contra pérdida de datos.
 * Demuestra el uso del pendingChangesGuard.
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements CanComponentDeactivate {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  // Estado del formulario
  formData = {
    name: '',
    description: '',
    price: 0,
    category: '',
    image: 'img/t-rex.png',
    stock: 0,
    featured: false
  };

  // Control de estado del formulario
  isFormDirty = false;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  // Categorías disponibles
  readonly categories = [
    'Kits Educativos',
    'Figuras',
    'Puzzles',
    'Libros',
    'Peluches',
    'Juegos'
  ];

  // Imágenes disponibles
  readonly availableImages = [
    { value: 'img/t-rex.png', label: 'T-Rex' },
    { value: 'img/velocirraptor.png', label: 'Velociraptor' },
    { value: 'img/triceratops.png', label: 'Triceratops' },
    { value: 'img/quetzalcoatl.png', label: 'Quetzalcoatl' },
    { value: 'img/argentinasaurus.png', label: 'Argentinasaurio' }
  ];

  /**
   * Implementación de CanComponentDeactivate
   * Retorna false si hay cambios sin guardar (el guard mostrará confirmación)
   */
  canDeactivate(): boolean {
    if (this.isSubmitting) return true;
    return !this.isFormDirty;
  }

  /**
   * Marca el formulario como modificado
   */
  onFieldChange(): void {
    this.isFormDirty = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    this.productService.createProduct(this.formData).subscribe({
      next: (product) => {
        this.isFormDirty = false;
        this.successMessage = `Producto "${product.name}" creado exitosamente`;

        setTimeout(() => {
          this.router.navigate(['/productos'], {
            state: { newProduct: product }
          });
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = 'Error al crear el producto: ' + error.message;
      }
    });
  }

  /**
   * Validación básica del formulario
   */
  private validateForm(): boolean {
    if (!this.formData.name.trim()) {
      this.errorMessage = 'El nombre del producto es requerido';
      return false;
    }
    if (!this.formData.description.trim()) {
      this.errorMessage = 'La descripción es requerida';
      return false;
    }
    if (this.formData.price <= 0) {
      this.errorMessage = 'El precio debe ser mayor a 0';
      return false;
    }
    if (!this.formData.category) {
      this.errorMessage = 'Selecciona una categoría';
      return false;
    }
    return true;
  }

  /**
   * Resetea el formulario
   */
  resetForm(): void {
    if (this.isFormDirty) {
      const confirmed = confirm('¿Estás seguro de que deseas limpiar el formulario?');
      if (!confirmed) return;
    }

    this.formData = {
      name: '',
      description: '',
      price: 0,
      category: '',
      image: 'img/t-rex.png',
      stock: 0,
      featured: false
    };
    this.isFormDirty = false;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
