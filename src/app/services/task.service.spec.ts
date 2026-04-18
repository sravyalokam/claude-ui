import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addTask', () => {
    it('adds a task with the given title', () => {
      service.addTask('Buy groceries');
      expect(service.tasks().length).toBe(1);
      expect(service.tasks()[0].title).toBe('Buy groceries');
    });

    it('trims whitespace from title', () => {
      service.addTask('  Trimmed  ');
      expect(service.tasks()[0].title).toBe('Trimmed');
    });

    it('does not add a blank task', () => {
      service.addTask('   ');
      expect(service.tasks().length).toBe(0);
    });

    it('marks new task as not completed', () => {
      service.addTask('New task');
      expect(service.tasks()[0].completed).toBe(false);
    });

    it('persists task to localStorage', () => {
      service.addTask('Persisted task');
      const stored = JSON.parse(localStorage.getItem('todo_tasks')!);
      expect(stored.length).toBe(1);
      expect(stored[0].title).toBe('Persisted task');
    });
  });

  describe('updateTask', () => {
    it('updates the title of a task', () => {
      service.addTask('Original');
      const id = service.tasks()[0].id;
      service.updateTask(id, 'Updated');
      expect(service.tasks()[0].title).toBe('Updated');
    });

    it('does not update with a blank title', () => {
      service.addTask('Original');
      const id = service.tasks()[0].id;
      service.updateTask(id, '   ');
      expect(service.tasks()[0].title).toBe('Original');
    });

    it('updates updatedAt timestamp', async () => {
      service.addTask('Task');
      const id = service.tasks()[0].id;
      const original = service.tasks()[0].updatedAt;
      await new Promise(r => setTimeout(r, 1));
      service.updateTask(id, 'Changed');
      expect(service.tasks()[0].updatedAt).not.toBe(original);
    });
  });

  describe('toggleComplete', () => {
    it('marks an incomplete task as completed', () => {
      service.addTask('Task');
      const id = service.tasks()[0].id;
      service.toggleComplete(id);
      expect(service.tasks()[0].completed).toBe(true);
    });

    it('marks a completed task as incomplete', () => {
      service.addTask('Task');
      const id = service.tasks()[0].id;
      service.toggleComplete(id);
      service.toggleComplete(id);
      expect(service.tasks()[0].completed).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('removes the task with given id', () => {
      service.addTask('Task A');
      service.addTask('Task B');
      const id = service.tasks()[0].id;
      service.deleteTask(id);
      expect(service.tasks().length).toBe(1);
      expect(service.tasks()[0].title).toBe('Task B');
    });

    it('updates localStorage after deletion', () => {
      service.addTask('Task');
      const id = service.tasks()[0].id;
      service.deleteTask(id);
      const stored = JSON.parse(localStorage.getItem('todo_tasks')!);
      expect(stored.length).toBe(0);
    });
  });

  describe('setFilter', () => {
    beforeEach(() => {
      service.addTask('Pending task');
      service.addTask('Done task');
      service.toggleComplete(service.tasks()[1].id);
    });

    it('returns all tasks with filter "all"', () => {
      service.setFilter('all');
      expect(service.filteredTasks().length).toBe(2);
    });

    it('returns only completed tasks with filter "completed"', () => {
      service.setFilter('completed');
      expect(service.filteredTasks().length).toBe(1);
      expect(service.filteredTasks()[0].title).toBe('Done task');
    });

    it('returns only pending tasks with filter "pending"', () => {
      service.setFilter('pending');
      expect(service.filteredTasks().length).toBe(1);
      expect(service.filteredTasks()[0].title).toBe('Pending task');
    });
  });

  describe('counts', () => {
    it('computes correct counts', () => {
      service.addTask('A');
      service.addTask('B');
      service.addTask('C');
      service.toggleComplete(service.tasks()[0].id);
      service.toggleComplete(service.tasks()[1].id);
      expect(service.counts()).toEqual({ all: 3, completed: 2, pending: 1 });
    });
  });

  describe('localStorage persistence', () => {
    it('loads existing tasks from storage on init', () => {
      const tasks = [
        {
          id: '123',
          title: 'Stored task',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('todo_tasks', JSON.stringify(tasks));
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const newService = TestBed.inject(TaskService);
      expect(newService.tasks().length).toBe(1);
      expect(newService.tasks()[0].title).toBe('Stored task');
    });

    it('returns empty array when storage is empty', () => {
      expect(service.tasks().length).toBe(0);
    });

    it('handles corrupted storage gracefully', () => {
      localStorage.setItem('todo_tasks', 'invalid json{{{');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({});
      const newService = TestBed.inject(TaskService);
      expect(newService.tasks().length).toBe(0);
    });
  });
});
