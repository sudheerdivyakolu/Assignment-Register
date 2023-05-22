import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Assignment } from '../assignment/assignment';
import { Failure, Success } from '../assignments';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  constructor(private http: HttpClient) { }

  getAssignment(id: String) {
    return this.http.get<Assignment>(`http://localhost:3500/assignments/${id}`)
  }

  postAssignment(assignment: Assignment) {
    return this.http.post<Success | Failure>('http://localhost:3500/assignments/new', assignment);
  }

  putAssignment(assignment: Assignment, id: String) {
    return this.http.put<Success | Failure>(`http://localhost:3500/assignments/${id}`, assignment);
  }

  deleteAssignment(id: String, permanently: boolean) {
    return this.http.delete<Success | Failure>(`http://localhost:3500/assignments/${id}`, { body: { permanently } });
  }

  backupAssignment(id: String) {
    return this.http.put<Success | Failure>(`http://localhost:3500/assignments/backup/${id}`, null);
  }
}
