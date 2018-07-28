import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message = '';
  loggedUser = sessionStorage.getItem('user');
  isValid = true;
  usr: string;
  pw: string;
  email: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.loggedUser != null) {
      this.router.navigate(['landing']);
    }
  }

  signInCognito() {
    console.log('[LOG] - In LoginComponent.signInCognito()');
    this.userService.signInCognito(this.email, this.pw).subscribe(idToken => {
      if (idToken !== null) {
        const payload = idToken.decodePayload();
        console.log(payload);
        let user = new User();
        user.id = 0;
        user.firstName = payload['given_name'];
        user.lastName = payload['family_name'];
        user.username = payload['preferred_username'];
        user.email = payload['email'];

        this.userService.registerUser(user).subscribe(result => {
          console.log(result);
        });
      }
    });
  }

  login() {
    console.log('[LOG] - In LoginComponent.login()');
    this.isValid = true;
    this.userService.loginUser([this.email, this.pw]).subscribe(user => {
      if (user == null || user.id === -1) {
        console.log('[ERROR] - Invalid credentials');
        this.isValid = false;
      } else {
        this.userService.subscribers.next(user);
        sessionStorage.setItem('user', JSON.stringify(user));
        console.log(`[LOG] - User, ${user.username}, successfully logged in!`);
        this.router.navigate(['landing']);
      }
    });
  }
}
