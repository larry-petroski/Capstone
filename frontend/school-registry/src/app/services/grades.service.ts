import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradesService {

  private gradesUrl = 'http://localhost:8085/api/grades';

  constructor(private http: HttpClient) { }

  getGrades<Grade>(): Observable<Grade> {
    return this.http.get<Grade>(this.gradesUrl);
  }
}
