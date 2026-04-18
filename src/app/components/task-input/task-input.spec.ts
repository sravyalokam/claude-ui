import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskInputComponent } from './task-input';
import { FormsModule } from '@angular/forms';

describe('TaskInputComponent', () => {
  let fixture: ComponentFixture<TaskInputComponent>;
  let component: TaskInputComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskInputComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits taskAdded with trimmed title on submit', () => {
    let emitted: string | undefined;
    component.taskAdded.subscribe((val: string) => (emitted = val));
    component.title.set('  Buy milk  ');
    component.submit();
    expect(emitted).toBe('Buy milk');
  });

  it('clears the input after submit', () => {
    component.title.set('Task');
    component.submit();
    expect(component.title()).toBe('');
  });

  it('does not emit when title is blank', () => {
    let emitted = false;
    component.taskAdded.subscribe(() => (emitted = true));
    component.title.set('   ');
    component.submit();
    expect(emitted).toBe(false);
  });

  it('submits on Enter keydown', () => {
    let emitted: string | undefined;
    component.taskAdded.subscribe((val: string) => (emitted = val));
    component.title.set('Press enter task');
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(emitted).toBe('Press enter task');
  });

  it('does not submit on non-Enter key', () => {
    let emitted = false;
    component.taskAdded.subscribe(() => (emitted = true));
    component.title.set('Task');
    component.onKeydown(new KeyboardEvent('keydown', { key: 'a' }));
    expect(emitted).toBe(false);
  });
});
