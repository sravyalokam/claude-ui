import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskService } from './services/task.service';
import { TaskInputComponent } from './components/task-input/task-input';
import { TaskFilterComponent } from './components/task-filter/task-filter';
import { TaskListComponent } from './components/task-list/task-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskInputComponent, TaskFilterComponent, TaskListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly taskService = inject(TaskService);

  addTask(title: string): void {
    this.taskService.addTask(title);
  }
}
