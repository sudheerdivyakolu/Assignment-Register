import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assignments } from '../assignments';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {

  constructor(private http: HttpClient) { }

  getAssignments$ = this.http.get<Assignments>('http://localhost:3500/assignments');
}