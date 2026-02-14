import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class Card {
  // Inputs: Reciben datos desde el Home
  @Input() category: string = 'Curiosidad';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() image: string = '';

  // Output: Emite evento cuando se presiona "Siguiente curiosidad"
  @Output() nextCuriosity = new EventEmitter<void>();

  // Estado del botón corazón
  isLiked: boolean = false;

  toggleLike() {
    this.isLiked = !this.isLiked;
  }

  onNextClick() {
    this.nextCuriosity.emit();
  }
}
