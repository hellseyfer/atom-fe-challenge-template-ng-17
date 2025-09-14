import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { AuthService } from './auth.service';
import { API_CONFIG } from '../config/app.config';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = API_CONFIG.baseUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<ApiResponse<{ tasks: Task[] }>>(
      `${this.apiUrl}/tasks`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error fetching tasks:', error);
        return throwError(() => new Error('Failed to fetch tasks'));
      })
    ).pipe(
      map(response => response.data.tasks || [])
    );
  }

  getTask(taskId: string): Observable<Task> {
    return this.http.get<ApiResponse<{ task: Task }>>(
      `${this.apiUrl}/tasks/${taskId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error fetching task:', error);
        return throwError(() => new Error('Failed to fetch task'));
      })
    ).pipe(
      map(response => response.data.task)
    );
  }

  createTask(task: { title: string; description?: string }): Observable<Task> {
    return this.http.post<ApiResponse<{ task: Task }>>(
      `${this.apiUrl}/tasks`,
      task,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error adding task:', error);
        return throwError(() => new Error('Failed to add task'));
      })
    ).pipe(
      map(response => response.data.task)
    );
  }

  updateTask(taskId: string, updates: { title?: string; description?: string; completed?: boolean }): Observable<Task> {
    return this.http.patch<ApiResponse<{ task: Task }>>(
      `${this.apiUrl}/tasks/${taskId}`,
      updates,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error updating task:', error);
        return throwError(() => new Error('Failed to update task'));
      })
    ).pipe(
      map(response => response.data.task)
    );
  }

  deleteTask(taskId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/tasks/${taskId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error deleting task:', error);
        return throwError(() => new Error('Failed to delete task'));
      })
    );
  }
}
