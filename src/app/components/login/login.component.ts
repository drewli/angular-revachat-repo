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
  em: string;
  pw: string;
  email: string;
  password: string;
  disabled = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.loggedUser != null) {
      this.router.navigate(['landing']);
    }

    this.userService.loadUsers();
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
        const payload = idToken.decodePayload();
        console.log(payload);

        // If they have verified their email address
        if (payload['email_verified'] === true) {
          console.log('Email is verified');
          console.log(this.userService.users);
          // sameName = this.userService.users.filter(value => {
          //   return value.email !== this.email;
          // });

          // Create the user to insert into our database
          let user = new User();
          user.firstName = payload['given_name'];
          user.lastName = payload['family_name'];
          user.username = payload['preferred_username'];
          user.email = payload['email'];

          // this.userService.registerUser(user).subscribe(
          //   function next(result) {
          //     console.log(result);
          //   },
          //   function error(err) {
          //     console.log(err);
          //     if (err['error']['statusCode'] === 409) {
                
          //     }
          //   }
          // );
        } else {
          this.message = 'Please verify your email address by clicking the link in the email we sent you.';
          this.disabled = false;
        }
      }
    });
  }
}
