import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { CognitoIdToken } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message = '';
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
    this.userService.currentUser.subscribe(user => {
      if (user != null) {
        this.router.navigate(['chat']);
      }
    });

    this.userService.allUsers.subscribe(users => {
      this.users = users;
    });

    this.userService.loadUsers();
  }

  login() {
    console.log('[LOG] - In LoginComponent.login()');
    this.disabled = true;
    this.email = this.em;
    this.password = this.pw;
    this.isValid = true;
    this.message = '';

    // First get the user's idToken from cognito
    this.userService.signInCognito(this.email, this.password).subscribe(idToken => {
      console.log('[LOG] - User authentication and login');
      if (idToken != null) {
        console.log('      - idToken is not null');
        const payload = idToken.decodePayload();

        if (!payload['given_name']) {
          console.log('      - Payload is empty; User does not exist');
          this.message = 'Invalid Credentials';
          this.disabled = false;
          return;
        }

        console.log('      - Payload is not empty; User exists');
        // Check if they already exist in our database
        const sameEmail = this.users.filter(u => {
          return u.email === this.email;
        });

        if (!sameEmail.length) {
          console.log('      - User is not in database');
          // If they have verified their email address
          if (payload['email_verified'] === true) {
            console.log('      - User has verified their email address');
            console.log('      - Inserting user record into the database');

            // Create the user to insert into our database
            let user = new User();
            user.firstName = payload['given_name'];
            user.lastName = payload['family_name'];
            user.username = payload['preferred_username'];
            user.email = payload['email'];

            this.userService.registerUser(user).subscribe(result => {
              console.log('      - Result');
              console.log(result);
              this.userService.currentUser.next(result);
              this.router.navigate(['chat']);
            });
          } else {
            console.log('      - User has not verified their email address');
            this.message = 'Please verify your email address by clicking the link in the email we sent you.';
            this.disabled = false;
          }
        } else {
          console.log('      - User is already in database');
          this.userService.currentUser.next(sameEmail[0]);
          console.log(sameEmail[0]);
          this.router.navigate(['chat']);
        }
      }
    });
  }
}
