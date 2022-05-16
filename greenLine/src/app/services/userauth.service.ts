import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserauthService {
  public currentUserSubject: BehaviorSubject<string>;
  public currentUser: Observable<string>;
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(
      localStorage.getItem('token') || ''
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  LoginUser(userForm: any) {
    console.log(userForm);
    return this.http.post(
      `${environment.baseUrl}Login?email=${userForm.email}&password=${userForm.password}`,
      userForm
    );
  }
  SignUpUser(userForm: any) {
    return this.http.post(
      `${environment.baseUrl}CreateUser?firstname=${userForm.firstname}&lastname=${userForm.lastname}&email=${userForm.email}&phonenumber=${userForm.phonenumber}&password=${userForm.password}&roles=${userForm.roles}`,
      userForm
    );
  }
  public get currentUserValue(): string {
    return this.currentUserSubject.value;
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.currentUserSubject.next(token);
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    this.currentUserSubject.next('');
  }
}
