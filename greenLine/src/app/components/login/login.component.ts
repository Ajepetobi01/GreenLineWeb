import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserauthService } from 'src/app/services/userauth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
    `
      .login-form {
        max-width: 300px;
      }

      .login-form-margin {
        margin-bottom: 16px;
      }

      .login-form-forgot {
        float: right;
        color: #5948df;
      }

      .login-form-button {
        width: 100%;
      }
      .login-form-button-2 {
        width: 50%;
        border-radius: 20px;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  LoginForm!: FormGroup;
  resetForm!: FormGroup;
  isLoading = false;
  loading = false;
  returnUrl: string;
  res: any;
  isVisible = false;

  constructor(
    private fb: FormBuilder,
    private authservice: UserauthService,
    private nzNotify: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    if (this.authservice.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.LoginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    this.resetForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    this.isLoading = true;
    console.log(this.LoginForm.value);
    this.authservice.LoginUser(this.LoginForm.value).subscribe(
      (res) => {
        console.log(res);
        this.res = res as any;
        if (this.res.data != null || this.res.data != undefined) {
          this.authservice.setToken(this.res.data.token);
          this.router.navigate([this.returnUrl]);
        } else {
          this.nzNotify.error(this.res.message);
        }
        this.LoginForm.reset();
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
  signUpPage() {
    this.router.navigateByUrl('/signup');
  }
  handleOk(): void {
    this.loading = true;
    this.http
      .post(
        `${environment.baseUrl}ResetPassword?userEmail=${
          this.resetForm.get('email')?.value
        }&newPassword=${this.resetForm.get('password')?.value}`,
        null
      )
      .subscribe((res: any) => {
        if (res.data) {
          this.nzNotify.success(res.message);
        } else {
          this.nzNotify.error(res.message);
        }
        this.loading = false;
      });
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
