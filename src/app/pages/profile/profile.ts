import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Interfaz para los datos del usuario registrado (almacenado en localStorage)
 */
interface RegisteredUser {
  username: string;
  email: string;
  password: string;
  ageRange: string;
}

/**
 * Interfaz para los datos de sesión del usuario (almacenado en memoria)
 */
interface UserSession {
  username: string;
  profileImage: string;
  learningTime: number; // en minutos
  completedMinigames: number;
  totalMinigames: number;
  level: number;
}

/**
 * Estados del modal de autenticación
 */
type ModalState = 'question' | 'login' | 'register' | 'none';

/**
 * ProfileComponent - Página de perfil de usuario
 *
 * Funcionalidades:
 * - Pregunta inicial: ¿Estás registrado? Sí/No
 * - Sí: Login con usuario y contraseña
 * - No: Formulario de registro completo
 * - Datos de sesión en memoria (se pierden al cerrar)
 * - Datos de registro en localStorage (persisten)
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly REGISTERED_USERS_KEY = 'educadino_registered_users';
  private learningInterval: ReturnType<typeof setInterval> | null = null;

  // Estado del modal
  modalState: ModalState = 'question';

  // Datos del formulario de login
  loginForm = {
    username: '',
    password: ''
  };

  // Datos del formulario de registro
  registerForm = {
    username: '',
    email: '',
    password: '',
    ageRange: ''
  };

  // Errores de validación
  formErrors: { [key: string]: string } = {};
  loginError = '';

  // Sesión actual del usuario (en memoria, se pierde al cerrar)
  userSession: UserSession | null = null;

  // Control de edición
  isEditingUsername = false;
  isEditingPhoto = false;
  editUsername = '';

  // Opciones de rango de edad
  ageRanges = [
    { value: '6-8', label: 'De 6 a 8 años' },
    { value: '8-10', label: 'De 8 a 10 años' },
    { value: '10-12', label: 'De 10 a 12 años' }
  ];

  // Imágenes de perfil disponibles
  profileImages = [
    'assets/images/T-rex1200px.avif',
    'assets/images/Triceratops1200px.avif',
    'assets/images/Velocirraptor1200px.avif',
    'assets/images/Argentinasaurus1200px.avif',
    'img/quetzalcoatl.png',
    'assets/images/Microrraptor1200px.avif'
  ];

  ngOnInit(): void {
    // Siempre mostrar pregunta inicial al entrar
    this.modalState = 'question';
    this.userSession = null;
  }

  /**
   * Obtiene los usuarios registrados desde localStorage
   */
  private getRegisteredUsers(): RegisteredUser[] {
    const stored = localStorage.getItem(this.REGISTERED_USERS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  }

  /**
   * Guarda un nuevo usuario en localStorage
   */
  private saveRegisteredUser(user: RegisteredUser): void {
    const users = this.getRegisteredUsers();
    users.push(user);
    localStorage.setItem(this.REGISTERED_USERS_KEY, JSON.stringify(users));
  }

  /**
   * Busca un usuario por nombre de usuario
   */
  private findUser(username: string): RegisteredUser | undefined {
    const users = this.getRegisteredUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  /**
   * Inicia el temporizador de tiempo de aprendizaje
   */
  private startLearningTimer(): void {
    this.learningInterval = setInterval(() => {
      if (this.userSession) {
        this.userSession.learningTime += 1;
        this.updateLevel();
      }
    }, 60000); // 1 minuto
  }

  /**
   * Detiene el temporizador
   */
  private stopLearningTimer(): void {
    if (this.learningInterval) {
      clearInterval(this.learningInterval);
      this.learningInterval = null;
    }
  }

  /**
   * Actualiza el nivel del usuario basado en progreso
   */
  private updateLevel(): void {
    if (!this.userSession) return;

    const timePoints = Math.floor(this.userSession.learningTime / 30);
    const gamePoints = this.userSession.completedMinigames * 2;
    const totalPoints = timePoints + gamePoints;

    this.userSession.level = Math.max(1, Math.floor(totalPoints / 5) + 1);
  }

  /**
   * Usuario hace clic en "Sí" (ya está registrado)
   */
  onYesClick(): void {
    this.modalState = 'login';
    this.loginError = '';
    this.loginForm = { username: '', password: '' };
  }

  /**
   * Usuario hace clic en "No" (necesita registrarse)
   */
  onNoClick(): void {
    this.modalState = 'register';
    this.formErrors = {};
    this.registerForm = { username: '', email: '', password: '', ageRange: '' };
  }

  /**
   * Valida el formulario de login
   */
  private validateLogin(): boolean {
    this.loginError = '';

    if (!this.loginForm.username.trim()) {
      this.loginError = 'Ingresa tu nombre de usuario';
      return false;
    }

    if (!this.loginForm.password) {
      this.loginError = 'Ingresa tu contraseña';
      return false;
    }

    return true;
  }

  /**
   * Procesa el login
   */
  onLogin(): void {
    if (!this.validateLogin()) return;

    const user = this.findUser(this.loginForm.username);

    if (!user) {
      this.loginError = 'Usuario no encontrado';
      return;
    }

    if (user.password !== this.loginForm.password) {
      this.loginError = 'Contraseña incorrecta';
      return;
    }

    // Login exitoso - crear sesión en memoria
    this.userSession = {
      username: user.username,
      profileImage: 'src/assets/images/T-rex.avif',
      learningTime: 0,
      completedMinigames: 0,
      totalMinigames: 4,
      level: 1
    };

    this.modalState = 'none';
    this.startLearningTimer();
  }

  /**
   * Valida el formulario de registro
   */
  private validateRegister(): boolean {
    this.formErrors = {};

    if (!this.registerForm.username.trim()) {
      this.formErrors['username'] = 'El nombre de usuario es requerido';
    } else if (this.registerForm.username.length < 3) {
      this.formErrors['username'] = 'El nombre debe tener al menos 3 caracteres';
    } else if (this.findUser(this.registerForm.username)) {
      this.formErrors['username'] = 'Este nombre de usuario ya existe';
    }

    if (!this.registerForm.email.trim()) {
      this.formErrors['email'] = 'El email es requerido';
    } else if (!this.isValidEmail(this.registerForm.email)) {
      this.formErrors['email'] = 'Por favor ingresa un email válido';
    }

    if (!this.registerForm.password) {
      this.formErrors['password'] = 'La contraseña es requerida';
    } else if (this.registerForm.password.length < 4) {
      this.formErrors['password'] = 'La contraseña debe tener al menos 4 caracteres';
    }

    if (!this.registerForm.ageRange) {
      this.formErrors['ageRange'] = 'Por favor selecciona tu rango de edad';
    }

    return Object.keys(this.formErrors).length === 0;
  }

  /**
   * Valida formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Procesa el registro
   */
  onRegister(): void {
    if (!this.validateRegister()) return;

    // Guardar usuario en localStorage
    const newUser: RegisteredUser = {
      username: this.registerForm.username,
      email: this.registerForm.email,
      password: this.registerForm.password,
      ageRange: this.registerForm.ageRange
    };

    this.saveRegisteredUser(newUser);

    // Crear sesión en memoria
    this.userSession = {
      username: newUser.username,
      profileImage: 'src/assets/images/T-rex.avif',
      learningTime: 0,
      completedMinigames: 0,
      totalMinigames: 4,
      level: 1
    };

    this.modalState = 'none';
    this.startLearningTimer();
  }

  /**
   * Cancela y vuelve al inicio (tanto en login como en registro)
   */
  onCancel(): void {
    this.router.navigate(['/home']);
  }

  /**
   * Vuelve a la pregunta inicial
   */
  onBack(): void {
    this.modalState = 'question';
  }

  /**
   * Inicia la edición del nombre de usuario
   */
  startEditUsername(): void {
    if (this.userSession) {
      this.editUsername = this.userSession.username;
      this.isEditingUsername = true;
    }
  }

  /**
   * Guarda el nombre de usuario editado
   */
  saveUsername(): void {
    if (this.userSession && this.editUsername.trim()) {
      this.userSession.username = this.editUsername.trim();
    }
    this.isEditingUsername = false;
  }

  /**
   * Cancela la edición del nombre de usuario
   */
  cancelEditUsername(): void {
    this.isEditingUsername = false;
  }

  /**
   * Abre el selector de imagen de perfil
   */
  openPhotoSelector(): void {
    this.isEditingPhoto = true;
  }

  /**
   * Selecciona una nueva imagen de perfil
   */
  selectProfileImage(image: string): void {
    if (this.userSession) {
      this.userSession.profileImage = image;
    }
    this.isEditingPhoto = false;
  }

  /**
   * Cierra el selector de imagen
   */
  closePhotoSelector(): void {
    this.isEditingPhoto = false;
  }

  /**
   * Simula completar un minijuego
   */
  completeMinigame(): void {
    if (this.userSession && this.userSession.completedMinigames < this.userSession.totalMinigames) {
      this.userSession.completedMinigames += 1;
      this.updateLevel();
    }
  }

  /**
   * Formatea el tiempo de aprendizaje
   */
  get formattedLearningTime(): string {
    if (!this.userSession) return '0 min';

    const hours = Math.floor(this.userSession.learningTime / 60);
    const minutes = this.userSession.learningTime % 60;

    if (hours > 0) {
      return `${hours}/${hours + 1} Hs`;
    }
    return `${minutes}/60 min`;
  }

  /**
   * Porcentaje de tiempo para la gráfica circular
   */
  get learningTimePercent(): number {
    if (!this.userSession) return 0;
    const minutes = this.userSession.learningTime % 60;
    return Math.min(100, (minutes / 60) * 100);
  }

  /**
   * Porcentaje de minijuegos completados
   */
  get minigamesPercent(): number {
    if (!this.userSession) return 0;
    return Math.min(100, (this.userSession.completedMinigames / this.userSession.totalMinigames) * 100);
  }

  /**
   * Porcentaje de progreso del nivel
   */
  get levelProgress(): number {
    if (!this.userSession) return 0;
    const timePoints = Math.floor(this.userSession.learningTime / 30);
    const gamePoints = this.userSession.completedMinigames * 2;
    const totalPoints = timePoints + gamePoints;
    const pointsInCurrentLevel = totalPoints % 5;
    return (pointsInCurrentLevel / 5) * 100;
  }

  /**
   * Limpieza al destruir el componente
   */
  ngOnDestroy(): void {
    this.stopLearningTimer();
  }
}
