import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  readonly taskService = inject(TaskService);

  onToggle(id: string): void {
    this.taskService.toggleComplete(id);
  }

  onEdit(event: { id: string; title: string }): void {
    this.taskService.updateTask(event.id, event.title);
  }

  onDelete(id: string): void {
    this.taskService.deleteTask(id);
  }

  trackById(_index: number, item: { id: string }): string {
    return item.id;
  }
}
