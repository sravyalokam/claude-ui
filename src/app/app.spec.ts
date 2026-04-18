import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { App } from './app';
import { TaskService } from './services/task.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the app title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('My Tasks');
  });

  it('delegates addTask to TaskService', () => {
    const fixture = TestBed.createComponent(App);
    const service = TestBed.inject(TaskService);
    const spy = vi.spyOn(service, 'addTask');
    fixture.componentInstance.addTask('Test task');
    expect(spy).toHaveBeenCalledWith('Test task');
  });
});
