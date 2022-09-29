import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

import { UserService } from '../services/user.service';

@Component({
  selector: 'sr-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [MessageService],
})
export class AdminComponent implements OnInit {
  @Input() showLoginDialog!: boolean;
  @Output() closeDialog = new EventEmitter<any>();

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usersSvc: UserService,
    private msgSvc: MessageService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  verifyLogin(formValues: any) {
    this.usersSvc
      .login(formValues)
      .pipe(
        catchError((err) => {
          throw err;
        })
      )
      .subscribe(
        (res) => {
          this.usersSvc.admin.next(formValues);
          UserService.storeAdminLocal(formValues);
          this.close();
        },
        (err) => {
          if (err.status === 403) {
            this.msgSvc.add({
              severity: 'error',
              summary: 'Invalid Login',
              detail: 'Credentials do not match.',
            });
          } else {
            this.msgSvc.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An unknown error has occurred. Please try again later.',
            });
          }
        }
      );
  }

  close() {
    this.userForm.reset();
    this.closeDialog.emit();
  }
}
