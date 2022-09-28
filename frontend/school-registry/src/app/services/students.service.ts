import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Student } from '../models/student.model';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  private teachersUrl = 'http://localhost:8085/api/teachers';

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  getStudent(teacherId: number, studentId: number): Observable<Student> {
    return this.http.get<Student>(
      `${this.teachersUrl}/${teacherId}/students/${studentId}`
    );
  }

  addStudent(teacherId: number, student: Student): Observable<Student> {
    return this.http.post<Student>(
      `${this.teachersUrl}/${teacherId}/students`,
      student,
      this.jsonContentTypeHeaders
    );
  }

  deleteStudent(teacherId: number, studentId: number) {
    return this.http.delete(
      `${this.teachersUrl}/${teacherId}/students/${studentId}`
    );
  }

  updateStudent(teacherId: number, student: Student): Observable<Student> {
    return this.http.put<Student>(
      `${this.teachersUrl}/${teacherId}/students`,
      student,
      this.jsonContentTypeHeaders
    );
  }
}
