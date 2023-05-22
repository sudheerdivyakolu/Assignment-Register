import { Injectable } from '@angular/core';
import { Failure, Success } from '../assignments';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  constructor(private snackbar: MatSnackBar) { }

  snack(res: Success | Failure): void {
    if ('success' in res) {
      this.snackbar.open(res.success, '', { duration: 1500 });
    } else if ('message' in res) {
      this.snackbar.open(res.message, 'ok');
    }
  }
}
