import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeachersService {

  private allTeachersUrl = 'http://localhost:8085/api/teachers';
  private teachersByGradeUrl = 'http://localhost:8085/api/teachers/bygrade/';
  private teachers$ = new Subject<any>();

  constructor(private http: HttpClient) { }

  getAllTeachers() {
    return this.http.get<Teacher>(this.allTeachersUrl).subscribe({
      next: teacher => this.teachers$.next(teacher),
      error: err => console.error(err.message),
      complete: () => { }
    });
  }

  getTeachersByGrade(grade: string) {
    return this.http.get<Teacher>(this.teachersByGradeUrl + grade).subscribe({
      next: teacher => this.teachers$.next(teacher),
      error: err => console.error(err.message),
      complete: () => { }
    });
  }

  teachers() : Observable<Teacher[]> {
    return this.teachers$.asObservable();
  }
}
