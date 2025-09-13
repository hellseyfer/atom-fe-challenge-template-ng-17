import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface Task {
  id: number;
  title: string;
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
      { id: 1, title: 'Tarea de ejemplo 1', completed: false },
      { id: 2, title: 'Tarea de ejemplo 2', completed: true },
    ];
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Date.now(),
      title: this.newTaskTitle.trim(),
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
