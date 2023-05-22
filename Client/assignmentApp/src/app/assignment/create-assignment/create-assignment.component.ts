import { Component, OnDestroy, OnInit, Self } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { customValidator } from '../customValidators';
import { AssignmentService } from 'src/app/services/assignment.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SnackService } from 'src/app/services/snack.service';

@Component({
  selector: 'app-create-assignment',
  templateUrl: './create-assignment.component.html',
  styleUrls: ['./create-assignment.component.css'],
  providers: [AssignmentService]
})
export class CreateAssignmentComponent implements OnInit, OnDestroy {

  createForm!: FormGroup;

  subscription!: Subscription;

  constructor(private fb: FormBuilder,
    @Self() private assignmentService: AssignmentService,
    private router: Router,
    private snackService: SnackService) { }

  ngOnInit() {

    this.createForm = this.fb.group({

      name: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z][A-Za-z_0-9 ]{4,30}$/g)
        ]
      }),

      subject: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z][A-Za-z_0-9 ]{4,30}$/g)
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
  }

  createAssignment() {
    this.subscription = this.assignmentService.postAssignment(this.createForm.getRawValue()).subscribe(
      data => {
        this.snackService.snack(data);
        this.router.navigate(['/assignments']);
        this.createForm.reset();
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