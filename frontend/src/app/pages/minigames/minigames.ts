import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShadowGuessGame } from './shadow-guess/shadow-guess';
import { DinoFoodGame } from './dino-food/dino-food';
import { JurassicChronologyGame } from './jurassic-chronology/jurassic-chronology';

type AgeGroup = 'kids' | 'pre-teens' | 'teens';

@Component({
  selector: 'app-minigames',
  standalone: true,
  imports: [CommonModule, ShadowGuessGame, DinoFoodGame, JurassicChronologyGame],
  templateUrl: './minigames.html',
  styleUrl: './minigames.scss'
})
export class Minigames {
  selectedAge = signal<AgeGroup>('kids');

  selectAge(age: AgeGroup) {
    this.selectedAge.set(age);
  }
}
