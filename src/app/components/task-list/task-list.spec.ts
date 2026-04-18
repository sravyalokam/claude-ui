import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TaskListComponent } from './task-list';
import { TaskService } from '../../services/task.service';

describe('TaskListComponent', () => {
  let fixture: ComponentFixture<TaskListComponent>;
  let component: TaskListComponent;
  let service: TaskService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
    }).compileComponents();

    service = TestBed.inject(TaskService);
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows empty state when there are no tasks', () => {
    const empty = fixture.nativeElement.querySelector('.empty-state');
    expect(empty).toBeTruthy();
    expect(empty.textContent).toContain('No tasks yet');
  });

  it('renders a list item for each task', () => {
    service.addTask('Task 1');
    service.addTask('Task 2');
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('app-task-item');
    expect(items.length).toBe(2);
  });

  it('delegates toggle to taskService', () => {
    const spy = vi.spyOn(service, 'toggleComplete');
    service.addTask('Task');
    fixture.detectChanges();
    component.onToggle(service.tasks()[0].id);
    expect(spy).toHaveBeenCalledWith(service.tasks()[0].id);
  });

  it('delegates edit to taskService', () => {
    const spy = vi.spyOn(service, 'updateTask');
    service.addTask('Task');
    fixture.detectChanges();
    component.onEdit({ id: service.tasks()[0].id, title: 'New title' });
    expect(spy).toHaveBeenCalledWith(service.tasks()[0].id, 'New title');
  });

  it('delegates delete to taskService', () => {
    const spy = vi.spyOn(service, 'deleteTask');
    service.addTask('Task');
    fixture.detectChanges();
    const id = service.tasks()[0].id;
    component.onDelete(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  it('shows filter-specific empty state when filter finds no matches', () => {
    service.addTask('Task');
    service.setFilter('completed');
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.empty-state');
    expect(empty?.textContent).toContain('No tasks match this filter');
  });

  it('trackById returns task id', () => {
    const id = component.trackById(0, { id: 'xyz' });
    expect(id).toBe('xyz');
  });
});
