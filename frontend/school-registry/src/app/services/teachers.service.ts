import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root',
})
export class TeachersService {
  private teachersUrl = 'http://localhost:8085/api/teachers';
  private teachersByGradeUrl = 'http://localhost:8085/api/teachers/bygrade';
  private teachers$ = new Subject<Teacher[]>();

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(this.teachersUrl);
  }

  getTeachersByGrade(grade: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.teachersByGradeUrl}/${grade}`);
  }

  getTeacherById(id: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.teachersUrl}/${id}`);
  }

  sendTeacher(teacher: Teacher[]) {
    this.teachers$.next(teacher);
  }

  addTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.post<Teacher>(
      this.teachersUrl,
      teacher,
      this.jsonContentTypeHeaders
    );
  }

  updateTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.put<Teacher>(
      this.teachersUrl,
      teacher,
      this.jsonContentTypeHeaders
    );
  }

  deleteTeacher(id: number) {
    return this.http.delete(`${this.teachersUrl}/${id}`);
  }

  teachers(): Observable<Teacher[]> {
    return this.teachers$.asObservable();
  }
}
