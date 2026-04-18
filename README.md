# My Tasks — Angular To-Do App

A clean, production-ready To-Do List application built with Angular 21 using standalone components, Angular Signals, and LocalStorage persistence.

## Features

- **Add tasks** — type and press Enter or click Add
- **Edit tasks** — click the edit icon or double-click the title; press Enter to save, Escape to cancel
- **Delete tasks** — click the trash icon
- **Complete tasks** — click the checkbox to toggle completion
- **Filter tasks** — switch between All / Pending / Completed views with live counts
- **Persistent storage** — tasks survive page refreshes via LocalStorage

## Tech Stack

| Concern | Solution |
|---|---|
| Framework | Angular 21 (standalone components) |
| State management | Angular Signals |
| Styles | SCSS with CSS custom properties |
| Storage | LocalStorage via TaskService |
| Testing | Vitest (Angular CLI built-in) |
| Change detection | OnPush throughout |

## Project Structure

```
src/app/
├── models/
│   └── task.model.ts          # Task interface + FilterType
├── services/
│   ├── task.service.ts        # State + LocalStorage logic
│   └── task.service.spec.ts   # Service unit tests
├── components/
│   ├── task-input/            # Add-task input bar
│   ├── task-item/             # Single task row (edit / delete / toggle)
│   ├── task-list/             # Rendered list + empty state
│   └── task-filter/           # All / Pending / Completed filter pills
├── app.ts                     # Root component
└── app.html / app.scss        # Shell layout
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/sravyalokam/claude-ui.git
cd claude-ui

# Install dependencies
npm install

# Start the development server
npx ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Run Unit Tests

```bash
npx ng test
```

### Production Build

```bash
npx ng build
# Output in dist/todo-app/browser/
```

## Architectural Decisions

**Signals over RxJS** — Angular Signals (`signal`, `computed`) replace Observables for local state. They integrate naturally with `ChangeDetectionStrategy.OnPush` and require no manual subscription management.

**OnPush everywhere** — All components use `ChangeDetectionStrategy.OnPush`, limiting re-renders to when inputs change or signals update — zero unnecessary re-renders.

**Service owns all state** — `TaskService` is the single source of truth. Components read from it and call its methods; they hold no local copies of task arrays.

**Computed for derived state** — `filteredTasks` and `counts` are `computed()` signals that update automatically when the task list or active filter changes.

**trackById for @for** — The `@for` loop tracks tasks by ID, so Angular only re-renders the DOM nodes that actually changed.

## Feature Branches

| Branch | Feature |
|---|---|
| `feature/add-task` | Task input component + service.addTask() |
| `feature/edit-task` | Inline edit in task-item + service.updateTask() |
| `feature/delete-task` | Delete button + service.deleteTask() |
| `feature/task-filter` | Filter pills + service filter signal |
