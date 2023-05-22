import { Component, OnInit, Self, SkipSelf } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Failure, Success } from '../assignments';
import { LoginService } from '../services/login.service';
import { SnackService } from '../services/snack.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  res!: Failure | Success;

  subscription!: Subscription;

  constructor(private fb: FormBuilder,
    @Self() private userService: UserService,
    private router: Router,
    @SkipSelf() private loginService: LoginService,
    private snackService: SnackService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({

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
        validators: [
          Validators.required,
          Validators.minLength(7)
        ]
      })
    })
  }

  login() {
    this.subscription = this.userService.login(this.loginForm.getRawValue()).subscribe(
      data => {
        this.res = data;
        if ('success' in data) {
          this.loginService.isLoggedin = true;
        }
        this.snackService.snack(data);
        this.router.navigate(['/assignments']);
        this.loginForm.reset();
      },
      err => {
        this.snackService.snack({ message: err.error.message });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
