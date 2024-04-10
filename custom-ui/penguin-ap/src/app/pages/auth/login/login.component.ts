import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {Token} from "../../../core/models/login";
import {LocalstorageService} from "../../../core/services/localstorage.service";
import {LoadingService} from "../../../core/services/loading.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loading$ = this.loader.loading$;
  hide = true;
  deviceHeight: number = 0;
  public form: FormGroup = this.fb.group({});
  theme = localStorage.getItem('snTheme') || 'light';

  constructor(private router: Router,
              private fb: FormBuilder,
              public loader: LoadingService,
              private storage: LocalstorageService,
              private authService: AuthService) {
    this.getDeviceHeight(); // Call the method to get the initial device height
  }


  @HostListener('window:resize', ['$event'])
  getDeviceHeight() {
    this.deviceHeight = window.innerHeight - 1;
  }

  submitLogin() {
    if (this.form.valid) {
      this.authService.postLogin(this.form.value).subscribe((response: Token) => {
        this.storage.setData('access', response.token);
        this.storage.setData('refresh', response.refreshToken);
        this.router.navigateByUrl('/home')
      });
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

}
