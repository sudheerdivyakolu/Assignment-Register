import { Component, OnDestroy, OnInit } from '@angular/core';
import { Assign } from '../assignments';
import { AssignmentsService } from '../services/assignments.service';
import { Subscription } from 'rxjs';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css'],
  providers: [AssignmentsService]
})
export class BinComponent implements OnInit, OnDestroy {

  constructor(private assignmentsService: AssignmentsService,
    private snackService: SnackService) { }

  delAssigns!: Assign[];

  subscription!: Subscription;

  Assignments$ = this.assignmentsService.getAssignments$;

  ngOnInit(): void {
    this.subscription = this.Assignments$.subscribe(data => {
      this.delAssigns = data.deletedAssignmentList;
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
