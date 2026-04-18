import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { TaskFilterComponent } from './task-filter';
import { TaskService } from '../../services/task.service';

describe('TaskFilterComponent', () => {
  let fixture: ComponentFixture<TaskFilterComponent>;
  let component: TaskFilterComponent;
  let service: TaskService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TaskFilterComponent],
    }).compileComponents();

    service = TestBed.inject(TaskService);
    fixture = TestBed.createComponent(TaskFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders three filter buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.filter-btn');
    expect(buttons.length).toBe(3);
  });

  it('marks "All" as active by default', () => {
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.filter-btn');
    expect(buttons[0].classList).toContain('active');
    expect(buttons[1].classList).not.toContain('active');
    expect(buttons[2].classList).not.toContain('active');
  });

  it('calls taskService.setFilter when a filter button is clicked', () => {
    const spy = vi.spyOn(service, 'setFilter');
    const buttons: NodeListOf<HTMLButtonElement> =
      fixture.nativeElement.querySelectorAll('.filter-btn');
    buttons[1].click(); // Pending
    expect(spy).toHaveBeenCalledWith('pending');
  });

  it('displays task counts in each button', () => {
    service.addTask('A');
    service.addTask('B');
    service.toggleComplete(service.tasks()[0].id);
    fixture.detectChanges();

    const counts = fixture.nativeElement.querySelectorAll('.count');
    expect(counts[0].textContent.trim()).toBe('2'); // all
    expect(counts[1].textContent.trim()).toBe('1'); // pending
    expect(counts[2].textContent.trim()).toBe('1'); // completed
  });
});
