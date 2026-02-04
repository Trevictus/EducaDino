import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Profile } from './profile';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;

    // Limpiar localStorage antes de cada test
    localStorage.clear();

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show question modal on init', () => {
    expect(component.modalState).toBe('question');
    expect(component.userSession).toBeNull();
  });

  it('should switch to login modal when clicking Yes', () => {
    component.onYesClick();
    expect(component.modalState).toBe('login');
  });

  it('should switch to register modal when clicking No', () => {
    component.onNoClick();
    expect(component.modalState).toBe('register');
  });

  it('should validate login fields', () => {
    component.modalState = 'login';
    component.onLogin();
    expect(component.loginError).toBeTruthy();
  });

  it('should validate required fields on registration', () => {
    component.modalState = 'register';
    component.onRegister();

    expect(component.formErrors['username']).toBeDefined();
    expect(component.formErrors['email']).toBeDefined();
    expect(component.formErrors['password']).toBeDefined();
    expect(component.formErrors['ageRange']).toBeDefined();
  });

  it('should register user with valid data', () => {
    component.registerForm = {
      username: 'TestUser',
      email: 'test@example.com',
      password: 'test123',
      ageRange: '8-10'
    };

    component.onRegister();

    expect(component.userSession).toBeTruthy();
    expect(component.userSession?.username).toBe('TestUser');
    expect(component.modalState).toBe('none');
  });

  it('should login with registered user', () => {
    // Primero registrar usuario
    component.registerForm = {
      username: 'TestUser',
      email: 'test@example.com',
      password: 'test123',
      ageRange: '6-8'
    };
    component.onRegister();

    // Simular cierre de sesión (volver a entrar a la página)
    component.ngOnInit();

    // Cambiar a modal de login
    component.onYesClick();

    // Intentar login
    component.loginForm = {
      username: 'TestUser',
      password: 'test123'
    };
    component.onLogin();

    expect(component.userSession).toBeTruthy();
    expect(component.userSession!.username).toBe('TestUser');
    expect(component.modalState).toBe('none');
  });

  it('should fail login with wrong password', () => {
    // Primero registrar usuario
    component.registerForm = {
      username: 'TestUser',
      email: 'test@example.com',
      password: 'test123',
      ageRange: '6-8'
    };
    component.onRegister();

    // Simular cierre de sesión (volver a entrar a la página)
    component.ngOnInit();

    // Cambiar a modal de login
    component.onYesClick();

    // Intentar login con contraseña incorrecta
    component.loginForm = {
      username: 'TestUser',
      password: 'wrongpassword'
    };
    component.onLogin();

    expect(component.userSession).toBeNull();
    expect(component.loginError).toBe('Contraseña incorrecta');
  });

  it('should calculate level based on progress', () => {
    component.registerForm = {
      username: 'TestUser',
      email: 'test@example.com',
      password: 'test123',
      ageRange: '10-12'
    };

    component.onRegister();

    // Simular completar minijuegos
    component.completeMinigame();
    component.completeMinigame();

    expect(component.userSession?.completedMinigames).toBe(2);
    expect(component.userSession?.level).toBeGreaterThanOrEqual(1);
  });

  it('should go back to question modal when clicking cancel', () => {
    component.modalState = 'login';
    component.onBack();
    expect(component.modalState).toBe('question');

    component.modalState = 'register';
    component.onBack();
    expect(component.modalState).toBe('question');
  });
});
