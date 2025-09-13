import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface Task {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  completed: boolean;
}

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
  userEmail: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.userEmail = this.authService.getCurrentUser();
    this.loadTasks();
  }

  loadTasks() {
    // In a real app, you would load tasks from a service
    this.tasks = [
      { 
        id: 1, 
        title: 'Tarea de ejemplo 1', 
        description: 'Esta es una tarea de ejemplo con una descripción más detallada.',
        createdAt: new Date('2025-09-12T10:00:00'),
        completed: false 
      },
      { 
        id: 2, 
        title: 'Tarea completada', 
        description: 'Esta tarea ya está completada.',
        createdAt: new Date('2025-09-10T15:30:00'),
        completed: true 
      },
    ];
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      title: this.newTaskTitle.trim(),
      description: '',
      createdAt: new Date(),
      completed: false
    };
    
    this.tasks = [newTask, ...this.tasks];
    this.newTaskTitle = '';
  }

  toggleTaskCompletion(task: Task) {
    task.completed = !task.completed;
  }

  deleteTask(taskId: number) {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
  }

  logout() {
    this.authService.logout();
  }
}
