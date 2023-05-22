import { Component, OnDestroy, OnInit, SkipSelf } from '@angular/core';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from '../assignment';
import { Observable, Subscription, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackService } from 'src/app/services/snack.service';

@Component({
  selector: 'app-show-assignment',
  templateUrl: './show-assignment.component.html',
  styleUrls: ['./show-assignment.component.css']
})
export class ShowAssignmentComponent implements OnInit, OnDestroy {

  constructor(@SkipSelf() private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackService: SnackService) { }

  id!: String;

  subscription1!: Subscription;

  subscription2!: Subscription;

  subscription3!: Subscription;

  subscription4!: Subscription;

  subscription5!: Subscription;

  Assignment !: Assignment;

  ngOnInit(): void {
    this.subscription1 = this.route.params.subscribe((
      params => {
        this.id = params['id'];
        this.subscription5 = this.assignmentService.getAssignment(params['id']).subscribe(
          data => this.Assignment = data,
          err => {
            this.snackService.snack({ message: err.error.message });
          });
      }
    ));
  }

  edit() {
    this.router.navigateByUrl(`/assignments/${this.id}/edit`);
  }

  del() {
    this.subscription2 = this.assignmentService.deleteAssignment(this.id, false).subscribe(data => {
      this.snackService.snack(data);
      this.router.navigate(['/assignments']);
    },
      err => {
        this.snackService.snack({ message: err.error.message });
      });
  }

  expunge() {
    this.subscription3 = this.assignmentService.deleteAssignment(this.id, true).subscribe(data => {
      this.snackService.snack(data);
      this.router.navigate(['/assignments']);
    },
      err => {
        this.snackService.snack({ message: err.error.message });
      });
  }

  backup() {
    this.subscription4 = this.assignmentService.backupAssignment(this.id).subscribe(data => {
      this.snackService.snack(data);
      this.router.navigate(['/assignments']);
    },
      err => {
        this.snackService.snack({ message: err.error.message });
      });
  }

  ngOnDestroy(): void {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
    if (this.subscription3) {
      this.subscription3.unsubscribe();
    }
    if (this.subscription4) {
      this.subscription4.unsubscribe();
    }
    if (this.subscription5) {
      this.subscription5.unsubscribe();
    }
  }
}
