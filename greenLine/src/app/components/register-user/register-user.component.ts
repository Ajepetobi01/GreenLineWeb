import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserauthService } from 'src/app/services/userauth.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styles: [
    `
      .login-form {
        max-width: 400px;
      }

      .login-form-margin {
        margin-bottom: 16px;
      }

      .login-form-forgot {
        float: right;
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
export class RegisterUserComponent implements OnInit {
  SignUpForm!: FormGroup;
  isLoading = false;
  showPasswordOnPress: boolean = false;
  res: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authservice: UserauthService,
    private nzNotify: NzMessageService
  ) {}

  ngOnInit(): void {
    this.SignUpForm = this.fb.group({
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phonenumber: [null, [Validators.required]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
      roles: ['User'],
    });
  }
  submitForm(): void {
    this.isLoading = true;
    console.log(this.SignUpForm.value);
    this.authservice.SignUpUser(this.SignUpForm.value).subscribe((res) => {
      this.res = res;
      if (this.res.data) {
        this.nzNotify.success(this.res.message);
        this.router.navigateByUrl('/login');
      } else {
        this.nzNotify.error(this.res.message);
      }
      this.isLoading = false;
    });
  }
  signInPage() {
    this.router.navigateByUrl('/login');
  }
}
