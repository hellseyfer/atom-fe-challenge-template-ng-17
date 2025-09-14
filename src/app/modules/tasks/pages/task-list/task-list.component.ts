import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { TaskService, Task } from '../../../../core/services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  user: { id: string; email: string } | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
      this.loadTasks();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadTasks(): void {
    if (!this.user) return;
    
    this.isLoading = true;
    this.taskService.getTasks()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error) => {
          console.error('Error loading tasks:', error);
          this.error = 'Error al cargar las tareas';
        }
      });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim() || !this.user) return;
    
    this.isLoading = true;
    this.taskService.createTask(
      {
        title: this.newTaskTitle,
        description: this.newTaskDescription || ''
      }
    ).pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTaskTitle = '';
        this.newTaskDescription = '';
      },
      error: (error) => {
        console.error('Error adding task:', error);
        this.error = 'Error al agregar la tarea';
      }
    });
  }

  toggleTaskCompletion(task: Task): void {
    if (!this.user) return;
    
    this.taskService.updateTask(
      task.id,
      { completed: !task.completed }
    ).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.error = 'Error al actualizar la tarea';
      }
    });
  }

  deleteTask(taskId: string): void {
    if (!this.user) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.tasks = this.tasks.filter(task => task.id !== taskId);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.error = 'Error al eliminar la tarea';
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }
}
