import {
  Component,
  ChangeDetectionStrategy,
  output,
  signal,
  ElementRef,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-input.html',
  styleUrl: './task-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskInputComponent {
  readonly taskAdded = output<string>();

  title = signal('');
  inputRef = viewChild<ElementRef<HTMLInputElement>>('taskInput');

  submit(): void {
    const val = this.title().trim();
    if (!val) return;
    this.taskAdded.emit(val);
    this.title.set('');
    this.inputRef()?.nativeElement.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.submit();
    }
  }
}
