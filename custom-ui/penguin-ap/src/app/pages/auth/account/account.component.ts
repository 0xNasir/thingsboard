import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {LocalstorageService} from "../../../core/services/localstorage.service";
import {jwtDecode} from "jwt-decode";
import {User} from "../../../core/models/user";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit {
  userData: any = {};
  form: FormGroup = this.fb.group({
    firstName: [],
    lastName: [],
    email: ['', Validators.required],
    phone: []
  });

  constructor(private fb: FormBuilder,
              private storage: LocalstorageService,
              private _snackbar: MatSnackBar,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    let token: string = this.storage.getDataByKey('access');
    try {
      let user: User = jwtDecode(token);
      this.authService.getAuthUser(user.userId).subscribe(res => {
        this.userData = res;
        this.form.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          phone: res.phone
        });
      });
    } catch (e) {
    }
  }

  submitForm() {
    if (this.form.valid) {
      Object.keys(this.form.value).forEach(key => {
        this.userData[key] = this.form.value[key];
      });
      this.authService.postUserData(this.userData).subscribe({
        next: (res)=>{
          this._snackbar.open('Account is updated successfully.', 'OK', {duration: 3000});
        },
        error: err => {
          this._snackbar.open('Something went wrong. Try again.', 'OK', {duration: 3000});
        }
      });
    }
  }
}
