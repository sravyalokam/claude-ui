import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { FilterType } from '../../models/task.model';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  templateUrl: './task-filter.html',
  styleUrl: './task-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFilterComponent {
  readonly taskService = inject(TaskService);

  readonly filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
  ];

  setFilter(filter: FilterType): void {
    this.taskService.setFilter(filter);
  }
}
