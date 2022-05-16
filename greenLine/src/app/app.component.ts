import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserauthService } from './services/userauth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isCollapsed = false;
  haveToken = false;
  constructor(private auth: UserauthService, private router: Router) {
    this.checkToken();
  }
  checkToken() {
    let val = '';
    this.auth.currentUser.subscribe((x) => {
      if (x.length > 1) {
        this.haveToken = true;
      } else {
        this.haveToken = false;
      }
    });
  }
  Logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
