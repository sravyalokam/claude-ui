import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  ElementRef,
  viewChild,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  readonly task = input.required<Task>();
  readonly toggled = output<string>();
  readonly edited = output<{ id: string; title: string }>();
  readonly deleted = output<string>();

  isEditing = signal(false);
  editTitle = signal('');
  editInput = viewChild<ElementRef<HTMLInputElement>>('editInput');

  constructor() {
    effect(() => {
      if (this.isEditing()) {
        setTimeout(() => this.editInput()?.nativeElement.focus(), 0);
      }
    });
  }

  startEdit(): void {
    this.editTitle.set(this.task().title);
    this.isEditing.set(true);
  }

  saveEdit(): void {
    const trimmed = this.editTitle().trim();
    if (trimmed && trimmed !== this.task().title) {
      this.edited.emit({ id: this.task().id, title: trimmed });
    }
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  onEditKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.saveEdit();
    if (event.key === 'Escape') this.cancelEdit();
  }
}
