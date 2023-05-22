import { Component, OnDestroy, OnInit, Self } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { customValidator } from '../customValidators';
import { Assignment } from '../assignment';
import { Observable, Subscription, map } from 'rxjs';
import { AssignmentService } from 'src/app/services/assignment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackService } from 'src/app/services/snack.service';

@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.css'],
  providers: [AssignmentService]
})
export class EditAssignmentComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
    @Self() private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackService: SnackService) { }

  id!: String;

  editForm!: FormGroup;

  subscription1!: Subscription;

  subscription2!: Subscription;

  subscription3!: Subscription;

  Assignment$ !: Observable<Assignment>;

  ngOnInit() {

    this.editForm = this.fb.group({

      name: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]
      }),

      subject: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30)
        ]
      }),

      range: this.fb.group({
        startDate: new FormControl(new Date(), {
          updateOn: 'blur',
          validators: [
            Validators.required,
            customValidator.validateStartDate
          ]
        }),

        endDate: new FormControl(new Date(), {
          validators: [
            Validators.required,
            customValidator.validateEndDate
          ]
        })
      })
    });

    this.subscription1 = this.route.params.subscribe((
      params => {
        this.id = params['id'];
        this.Assignment$ = this.assignmentService.getAssignment(params['id'])
      }
    ));

    this.subscription2 = this.Assignment$.subscribe(data => {
      this.editForm.setValue({
        name: data.name,
        subject: data.subject,
        range: {
          startDate: data.startDate.toString().slice(0, 10),
          endDate: data.endDate.toString().slice(0, 10)
        }
      });
    },
      err => {
        this.snackService.snack({ message: err.error.message });
      });
  }

  editAssignment() {
    this.subscription3 = this.assignmentService.putAssignment(this.editForm.getRawValue(), this.id).subscribe(data => {
      this.snackService.snack(data);
      this.router.navigate(['/assignments', this.id]);
    },
      err => {
        this.snackService.snack({ message: err.error.message });
      });
  }

  goback(): void {
    this.router.navigate(['/assignments', this.id]);
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
  }
}
