import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../signup/signup';
import { Failure, Success } from '../assignments';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  signup(user: User) {
    return this.http.post<Success | Failure>('http://localhost:3500/signup', user);
  }

  login(user: User) {
    return this.http.post<Success | Failure>('http://localhost:3500/login', user);
  }

  logout() {
    return this.http.post<Success | Failure>('http://localhost:3500/logout', null);
  }

  delete() {
    return this.http.delete<Success | Failure>('http://localhost:3500/user');
  }
}
