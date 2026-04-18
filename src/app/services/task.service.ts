import { Injectable, signal, computed } from '@angular/core';
import { Task, FilterType, TaskCounts } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly STORAGE_KEY = 'todo_tasks';

  private _tasks = signal<Task[]>(this.loadFromStorage());
  private _filter = signal<FilterType>('all');

  readonly tasks = this._tasks.asReadonly();
  readonly filter = this._filter.asReadonly();

  readonly filteredTasks = computed<Task[]>(() => {
    const tasks = this._tasks();
    const filter = this._filter();
    switch (filter) {
      case 'completed':
        return tasks.filter(t => t.completed);
      case 'pending':
        return tasks.filter(t => !t.completed);
      default:
        return tasks;
    }
  });

  readonly counts = computed<TaskCounts>(() => {
    const tasks = this._tasks();
    const completed = tasks.filter(t => t.completed).length;
    return {
      all: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  });

  addTask(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._tasks.update(tasks => [...tasks, task]);
    this.persist();
  }

  updateTask(id: string, title: string): void {
    const trimmed = title.trim();
    if (!trimmed) return;
    this._tasks.update(tasks =>
      tasks.map(t =>
        t.id === id
          ? { ...t, title: trimmed, updatedAt: new Date().toISOString() }
          : t
      )
    );
    this.persist();
  }

  toggleComplete(id: string): void {
    this._tasks.update(tasks =>
      tasks.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() }
          : t
      )
    );
    this.persist();
  }

  deleteTask(id: string): void {
    this._tasks.update(tasks => tasks.filter(t => t.id !== id));
    this.persist();
  }

  setFilter(filter: FilterType): void {
    this._filter.set(filter);
  }

  private loadFromStorage(): Task[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Task[]) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._tasks()));
    } catch {
      // Storage quota exceeded — silently ignore
    }
  }
}
