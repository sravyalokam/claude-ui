import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';
import { ComponentRef } from '@angular/core';

const mockTask: Task = {
  id: 'abc-123',
  title: 'Test task',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskItemComponent', () => {
  let fixture: ComponentFixture<TaskItemComponent>;
  let component: TaskItemComponent;
  let ref: ComponentRef<TaskItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskItemComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    ref = fixture.componentRef;
    ref.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the task title', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Test task');
  });

  it('emits toggled with task id when checkbox changes', () => {
    let emittedId: string | undefined;
    component.toggled.subscribe((id: string) => (emittedId = id));
    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('.checkbox');
    checkbox.dispatchEvent(new Event('change'));
    expect(emittedId).toBe('abc-123');
  });

  it('enters edit mode on startEdit()', () => {
    component.startEdit();
    fixture.detectChanges();
    expect(component.isEditing()).toBe(true);
    expect(component.editTitle()).toBe('Test task');
  });

  it('emits edited event with new title on saveEdit()', () => {
    let emitted: { id: string; title: string } | undefined;
    component.edited.subscribe((e: { id: string; title: string }) => (emitted = e));
    component.startEdit();
    component.editTitle.set('Updated task');
    component.saveEdit();
    expect(emitted).toEqual({ id: 'abc-123', title: 'Updated task' });
    expect(component.isEditing()).toBe(false);
  });

  it('does not emit edited if title is unchanged', () => {
    let emitted = false;
    component.edited.subscribe(() => (emitted = true));
    component.startEdit();
    component.saveEdit();
    expect(emitted).toBe(false);
  });

  it('cancels edit mode on cancelEdit()', () => {
    component.startEdit();
    component.cancelEdit();
    expect(component.isEditing()).toBe(false);
  });

  it('saves on Enter key', () => {
    let emitted: { id: string; title: string } | undefined;
    component.edited.subscribe((e: { id: string; title: string }) => (emitted = e));
    component.startEdit();
    component.editTitle.set('Enter saved');
    component.onEditKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(emitted?.title).toBe('Enter saved');
  });

  it('cancels on Escape key', () => {
    component.startEdit();
    component.onEditKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.isEditing()).toBe(false);
  });

  it('emits deleted with task id', () => {
    let emittedId: string | undefined;
    component.deleted.subscribe((id: string) => (emittedId = id));
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.delete-btn');
    btn.click();
    expect(emittedId).toBe('abc-123');
  });
});
