import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ShadowQuestion {
  id: number;
  shadowImage: string;
  correctAnswer: string;
  options: string[];
}

@Component({
  selector: 'app-shadow-guess',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shadow-guess.html',
  styleUrl: './shadow-guess.scss'
})
export class ShadowGuessGame {
  currentQuestion = signal<number>(0);
  score = signal<number>(0);
  gameStarted = signal<boolean>(false);
  selectedAnswer = signal<string | null>(null);
  showResult = signal<boolean>(false);
  isCorrect = signal<boolean>(false);

  questions: ShadowQuestion[] = [
    {
      id: 1,
      shadowImage: 'img/T-rex.png',
      correctAnswer: 'Tiranosaurio Rex',
      options: ['Triceratops', 'Tiranosaurio Rex', 'Velocirraptor']
    },
    {
      id: 2,
      shadowImage: 'img/triceratops.png',
      correctAnswer: 'Triceratops',
      options: ['Argentinosauro', 'Tiranosaurio Rex', 'Triceratops']
    },
    {
      id: 3,
      shadowImage: 'img/velocirraptor.png',
      correctAnswer: 'Velocirraptor',
      options: ['Velocirraptor', 'Quetzalcoatlus', 'Argentinosauro']
    },
    {
      id: 4,
      shadowImage: 'img/Argentinasaurus.png',
      correctAnswer: 'Argentinosauro',
      options: ['Microrraptor', 'Argentinosauro', 'Triceratops']
    },
    {
      id: 5,
      shadowImage: 'img/quetzalcoatl.png',
      correctAnswer: 'Quetzalcoatlus',
      options: ['Tiranosaurio Rex', 'Velocirraptor', 'Quetzalcoatlus']
    }
  ];

  startGame() {
    this.gameStarted.set(true);
    this.currentQuestion.set(0);
    this.score.set(0);
  }

  selectAnswer(answer: string) {
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
    this.gameStarted.set(false);
  }

  restartGame() {
    this.startGame();
  }

  get currentQuestionData(): ShadowQuestion {
    return this.questions[this.currentQuestion()];
  }

  get totalQuestions(): number {
    return this.questions.length;
  }
}
