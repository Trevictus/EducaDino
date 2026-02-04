import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DinoFoodQuestion {
  id: number;
  dinosaur: string;
  dinoImage: string;
  correctAnswer: 'Herbívoro' | 'Carnívoro';
  fun_fact: string;
}

@Component({
  selector: 'app-dino-food',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dino-food.html',
  styleUrl: './dino-food.scss'
})
export class DinoFoodGame {
  currentQuestion = signal<number>(0);
  score = signal<number>(0);
  gameStarted = signal<boolean>(false);
  selectedAnswer = signal<'Herbívoro' | 'Carnívoro' | null>(null);
  showResult = signal<boolean>(false);
  isCorrect = signal<boolean>(false);
  showFinalResults = signal<boolean>(false);

  questions: DinoFoodQuestion[] = [
    {
      id: 1,
      dinosaur: 'Tiranosaurio Rex',
      dinoImage: 'assets/images/T-rex1200px.avif',
      correctAnswer: 'Carnívoro',
      fun_fact: '¡Correcto! El Tiranosaurio Rex era el depredador más grande de su época. Comía otros dinosaurios. ¡Tenía dientes del tamaño de una banana!'
    },
    {
      id: 2,
      dinosaur: 'Triceratops',
      dinoImage: 'assets/images/Triceratops1200px.avif',
      correctAnswer: 'Herbívoro',
      fun_fact: '¡Bien! El Triceratops comía plantas y vegetación. Usaba sus tres cuernos para defenderse de los depredadores.'
    },
    {
      id: 3,
      dinosaur: 'Velocirraptor',
      dinoImage: 'assets/images/Velocirraptor1200px.avif',
      correctAnswer: 'Carnívoro',
      fun_fact: '¡Exacto! El Velocirraptor era un cazador inteligente y rápido que comía otros dinosaurios más pequeños.'
    },
    {
      id: 4,
      dinosaur: 'Argentinosauro',
      dinoImage: 'assets/images/Argentinasaurus1200px.avif',
      correctAnswer: 'Herbívoro',
      fun_fact: '¡Correcto! El Argentinosauro era el animal terrestre más grande. Comía plantas todo el día durante horas.'
    },
    {
      id: 5,
      dinosaur: 'Microrraptor',
      dinoImage: 'assets/images/Microrraptor1200px.avif',
      correctAnswer: 'Carnívoro',
      fun_fact: '¡Muy bien! El Microrraptor era pequeño pero peligroso. Cazaba animales pequeños y otros dinosaurios.'
    }
  ];

  startGame() {
    this.gameStarted.set(true);
    this.currentQuestion.set(0);
    this.score.set(0);
  }

  selectAnswer(answer: 'Herbívoro' | 'Carnívoro') {
    if (this.showResult()) return;

    this.selectedAnswer.set(answer);
    this.showResult.set(true);

    const isAnswerCorrect = answer === this.questions[this.currentQuestion()].correctAnswer;
    this.isCorrect.set(isAnswerCorrect);

    if (isAnswerCorrect) {
      this.score.update(s => s + 1);
    }
  }

  nextQuestion() {
    if (this.currentQuestion() < this.questions.length - 1) {
      this.currentQuestion.update(q => q + 1);
      this.selectedAnswer.set(null);
      this.showResult.set(false);
    } else {
      this.endGame();
    }
  }

  endGame() {
    this.showFinalResults.set(true);
  }

  restartGame() {
    this.showFinalResults.set(false);
    this.startGame();
  }

  get currentQuestionData(): DinoFoodQuestion {
    return this.questions[this.currentQuestion()];
  }

  get totalQuestions(): number {
    return this.questions.length;
  }
}
