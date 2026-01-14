import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Ordenes } from './ordenes';

describe('Ordenes', () => {
  let component: Ordenes;
  let fixture: ComponentFixture<Ordenes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ordenes]
    }).compileComponents();

    fixture = TestBed.createComponent(Ordenes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial selected item with Clasificación title', () => {
    expect(component.selectedItem.title).toBe('Clasificación');
  });

  it('should toggle like status', () => {
    expect(component.isLiked).toBe(false);
    component.toggleLike();
    expect(component.isLiked).toBe(true);
    component.toggleLike();
    expect(component.isLiked).toBe(false);
  });

  it('should toggle order expansion', () => {
    const order = component.orders[0];
    expect(order.expanded).toBe(false);
    component.toggleOrder(order);
    expect(order.expanded).toBe(true);
    component.toggleOrder(order);
    expect(order.expanded).toBe(false);
  });

  it('should select order and update selected item', () => {
    const order = component.orders[0];
    const mockEvent = new Event('click');
    component.selectOrder(mockEvent, order);
    expect(component.selectedItem.title).toBe(order.name);
    expect(component.selectedItem.description).toBe(order.description);
  });

  it('should have two main orders', () => {
    expect(component.orders.length).toBe(2);
    expect(component.orders[0].name).toBe('Saurischia');
    expect(component.orders[1].name).toBe('Ornithischia');
  });

  it('should toggle type expansion', () => {
    const type = component.orders[0].suborders[0].types[0];
    const mockEvent = new Event('click');
    expect(type.expanded).toBe(false);
    component.toggleType(mockEvent, type);
    expect(type.expanded).toBe(true);
    component.toggleType(mockEvent, type);
    expect(type.expanded).toBe(false);
  });

  it('should select dinosaur and update selected item', () => {
    const dinosaur = component.orders[0].suborders[0].types[0].dinosaurs[0];
    const mockEvent = new Event('click');
    component.selectDinosaur(mockEvent, dinosaur);
    expect(component.selectedItem.title).toBe(dinosaur.name);
    expect(component.selectedItem.description).toBe(dinosaur.description);
  });

  it('should have three dinosaurs per type', () => {
    const type = component.orders[0].suborders[0].types[0];
    expect(type.dinosaurs.length).toBe(3);
  });
});

