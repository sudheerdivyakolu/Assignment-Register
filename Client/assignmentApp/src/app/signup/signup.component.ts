import { Component, OnInit, SkipSelf } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Failure, Success } from '../assignments';
import { LoginService } from '../services/login.service';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;

  subscription!: Subscription;

  constructor(private fb: FormBuilder,
    @SkipSelf() private userService: UserService,
    private router: Router,
    @SkipSelf() private loginService: LoginService,
    private snackService: SnackService) { }

  ngOnInit() {
    this.signupForm = this.fb.group({

      username: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(30),
          Validators.pattern(/^[A-Za-z][A-Za-z_0-9]{7,30}$/g)
        ]
      }),

      password: new FormControl('', {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.minLength(7)
        ]
      }),

      mail: new FormControl('', {
        validators: [Validators.required, Validators.pattern(/^[A-Za-z][A-Za-z0-9.-_]+@[A-za-z]+\.[A-Za-z]{1,}$/g)]
      })
    });
  }

  signup() {
    this.subscription = this.userService.signup(this.signupForm.getRawValue()).subscribe(data => {
      this.loginService.isLoggedin = true;
      this.snackService.snack(data);
      this.router.navigate(['/assignments']);
      this.signupForm.reset();
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
