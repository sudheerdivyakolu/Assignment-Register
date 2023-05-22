import { Component, OnDestroy, OnInit } from '@angular/core';
import { Assign } from '../assignments';
import { Subscription } from 'rxjs';
import { AssignmentsService } from '../services/assignments.service';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit, OnDestroy {

  constructor(private assignmentsService: AssignmentsService,
    private snackService: SnackService) { }

  comAssigns!: Assign[];
  incomAssigns!: Assign[];

  subscription!: Subscription;

  Assignments$ = this.assignmentsService.getAssignments$;

  ngOnInit(): void {
    this.subscription = this.Assignments$.subscribe(data => {
      this.comAssigns = data.completedAssignmentList;
      this.incomAssigns = data.incompletedAssignmentList;
    },
      err => {
        this.snackService.snack({ message: err.error.message });
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
