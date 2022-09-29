import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User = {
    username: '',
    password: '',
    name: '',
    id: 1,
  };

  admin: ReplaySubject<User> = new ReplaySubject<User>(1);

  private loginUrl: string = 'http://localhost:8085/api/login';

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user')!);
      this.admin.next(user);
    } else {
      this.admin.next(this.user);
    }
  }

  login(user: User): Observable<any> {
    return this.http.post(this.loginUrl, user, this.jsonContentTypeHeaders);
  }

  logout() {
    localStorage.clear();
    this.admin.next(this.user);
  }

  static storeAdminLocal(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
