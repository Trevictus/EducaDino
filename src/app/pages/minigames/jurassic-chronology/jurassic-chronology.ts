import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChronologyQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

@Component({
  selector: 'app-jurassic-chronology',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jurassic-chronology.html',
  styleUrl: './jurassic-chronology.scss'
})
export class JurassicChronologyGame {
  currentQuestion = signal<number>(0);
  score = signal<number>(0);
  gameStarted = signal<boolean>(false);
  selectedAnswer = signal<string | null>(null);
  showResult = signal<boolean>(false);
  isCorrect = signal<boolean>(false);
  showFinalResults = signal<boolean>(false);

  questions: ChronologyQuestion[] = [
    {
      id: 1,
      question: '¿Cuál fue el primer período de la Era Mesozoica?',
      correctAnswer: 'Triásico',
      options: ['Triásico', 'Jurásico', 'Cretácico'],
      explanation: 'El Triásico fue el primer período de la Era Mesozoica (252-201 millones de años). En este período surgieron los primeros dinosaurios pequeños.'
    },
    {
      id: 2,
      question: '¿En qué período vivió el Tiranosaurio Rex?',
      correctAnswer: 'Cretácico',
      options: ['Triásico', 'Jurásico', 'Cretácico'],
      explanation: 'El Tiranosaurio Rex vivió durante el Cretácico (145-66 millones de años). Fue uno de los últimos grandes depredadores antes de la extinción.'
    },
    {
      id: 3,
      question: '¿Cuál fue el período más largo de la Era Mesozoica?',
      correctAnswer: 'Jurásico',
      options: ['Triásico', 'Jurásico', 'Cretácico'],
      explanation: 'El Jurásico fue el período más largo (201-145 millones de años). Es la "Edad de Oro" de los dinosaurios, cuando alcanzaron su mayor tamaño.'
    },
    {
      id: 4,
      question: '¿En qué período desaparecieron los dinosaurios?',
      correctAnswer: 'Cretácico',
      options: ['Triásico', 'Jurásico', 'Cretácico'],
      explanation: 'Los dinosaurios se extinguieron al final del Cretácico hace 66 millones de años, probablemente por un asteroide gigante.'
    },
    {
      id: 5,
      question: '¿Cuántos períodos tuvo la Era Mesozoica?',
      correctAnswer: 'Tres',
      options: ['Dos', 'Tres', 'Cuatro'],
      explanation: 'La Era Mesozoica tuvo tres períodos: Triásico, Jurásico y Cretácico. En total duró 186 millones de años.'
    },
    {
      id: 6,
      question: '¿En qué período apareció el Argentinosauro?',
      correctAnswer: 'Cretácico',
      options: ['Triásico', 'Jurásico', 'Cretácico'],
      explanation: 'El Argentinosauro vivió durante el Cretácico tardío. Era el animal terrestre más grande jamás conocido.'
    },
    {
      id: 7,
      question: '¿Cuál es el orden correcto de los períodos?',
      correctAnswer: 'Triásico, Jurásico, Cretácico',
      options: ['Triásico, Jurásico, Cretácico', 'Jurásico, Triásico, Cretácico', 'Cretácico, Jurásico, Triásico'],
      explanation: 'El orden correcto es Triásico, Jurásico y Cretácico. Representan la secuencia temporal de 252 a 66 millones de años.'
    },
    {
      id: 8,
      question: '¿En qué período vivieron los dinosaurios voladores más grandes?',
      correctAnswer: 'Cretácico',
      options: ['Triásico', 'Jurásico', 'Cretácico'],
      explanation: 'El Quetzalcoatlus, el animal volador más grande, vivió en el Cretácico. Tenía una envergadura de 11 metros.'
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
    this.showFinalResults.set(true);
  }

  restartGame() {
    this.showFinalResults.set(false);
    this.startGame();
  }

  get currentQuestionData(): ChronologyQuestion {
    return this.questions[this.currentQuestion()];
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  getPercentage(): number {
    return Math.round((this.score() / this.totalQuestions) * 100);
  }
}
