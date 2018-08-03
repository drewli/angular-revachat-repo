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
  loggedUser: string;
  isValid = true;
  em: string;
  pw: string;
  email: string;
  password: string;
  disabled = false;
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    console.log('[LOG] - In LoginComponent.ngOnInit()');
    this.loggedUser = sessionStorage.getItem('user');

    if (this.loggedUser !== 'none' && this.loggedUser !== null) {
      this.router.navigate(['chat']);
    }

    this.loadUsers();
  }

  loadUsers() {
    this.users = [];
    this.userService.getAllUsers().subscribe(u => {
      this.users = u;
    });
  }

  // signInCognito() {
  //   this.message = '';
  //   console.log('[LOG] - In LoginComponent.signInCognito()');
  //   this.userService.signInCognito(this.email, this.password).subscribe(idToken => {
  //     if (idToken !== null) {
  //       const payload = idToken.decodePayload();
  //       console.log(payload);
  //       let user = new User();
  //       user.firstName = payload['given_name'];
  //       user.lastName = payload['family_name'];
  //       user.username = payload['preferred_username'];
  //       user.email = payload['email'];

  //       this.userService.registerUser(user).subscribe(result => {
  //         console.log(result);
  //       });
  //     }
  //   });
  // }

  // login() {
  //   console.log('[LOG] - In LoginComponent.login()');
  //   this.isValid = true;
  //   this.userService.loginUser([this.email, this.pw]).subscribe(user => {
  //     if (user == null || user.userId === -1) {
  //       console.log('[ERROR] - Invalid credentials');
  //       this.isValid = false;
  //     } else {
  //       this.userService.subscribers.next(user);
  //       sessionStorage.setItem('user', JSON.stringify(user));
  //       console.log(`[LOG] - User, ${user.username}, successfully logged in!`);
  //       this.router.navigate(['landing']);
  //     }
  //   });
  // }

  login() {
    console.log('[LOG] - In LoginComponent.login()');
    this.disabled = true;
    this.email = this.em;
    this.password = this.pw;
    this.isValid = true;
    this.message = '';

    // First get the user's idToken from cognito
    this.userService.signInCognito(this.email, this.password).subscribe(idToken => {
      if (idToken != null) {
        // Check if they already exist in our database
        const sameEmail = this.users.filter(u => {
          return u.email === this.email;
        });

        if (!sameEmail.length) {
          const payload = idToken.decodePayload();
          console.log(payload);

          // If they have verified their email address
          if (payload['email_verified'] === true) {
            console.log('Email is verified');
            console.log(this.userService.users);

            // Create the user to insert into our database
            let user = new User();
            user.firstName = payload['given_name'];
            user.lastName = payload['family_name'];
            user.username = payload['preferred_username'];
            user.email = payload['email'];

            this.userService.registerUser(user).subscribe(
              function next(result) {
                console.log(result);
                sessionStorage.setItem('user', JSON.stringify(user));
                this.router.navigate(['chat']);
              },
              function error(err) {
                console.log(err);
              }
            );
          } else {
            this.message = 'Please verify your email address by clicking the link in the email we sent you.';
            this.disabled = false;
          }
        } else {
          sessionStorage.setItem('user', JSON.stringify(sameEmail[0]));
          this.router.navigate(['chat']);
        }
      }
    });
  }
}
