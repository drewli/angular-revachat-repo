import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  message = '';
  user = new User();
  users: User[] = [];
  isValid = false;
  loggedUser = sessionStorage.getItem('user');
  password = '';
  registered = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.loggedUser != null) {
      this.router.navigate(['landing']);
    }

    this.user.username = '';
    this.user.firstName = '';
    this.user.lastName = '';
    this.user.email = '';

    // this.loadUsers();
  }

  register() {
    this.userService.registerCognito(this.user, this.password);
    this.registered = true;
  }

  // loadUsers() {
  //   this.users = [];
  //   this.userService.getAllUsers().subscribe(u => {
  //     this.users = u;
  //   });
  // }

  // register() {
  //   if (this.role) {
  //     this.user.role = 2;
  //   }
  //   this.userService.registerUser(this.user).subscribe(u => {
  //     if (u.id === -1) {
  //       this.isValid = false;
  //     } else {
  //       this.userService.subscribers.next(u);
  //       localStorage.setItem('user', JSON.stringify(u));
  //       // console.log(`User, ${this.user.username}, successfully registered`);
  //       this.router.navigate(['landing']);
  //     }
  //   });
  // }

  validate() {
    console.log('Validating');
    this.message = '';
    this.isValid = true;

    // if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.username || !this.password) {
    //   this.message = 'Required fields are empty';
    //   this.isValid = false;
    // } else {
    if (this.user.firstName.length > 100 || this.user.firstName.length < 1) {
      this.message = 'First name must be between 1 and 100 characters';
      this.isValid = false;
    } else if (this.user.lastName.length > 100 || this.user.lastName.length < 1) {
      this.message = 'Last name must be between 1 and 100 characters';
      this.isValid = false;
    } else if (this.user.email.length > 100 || this.user.email.length < 1) {
      this.message = 'Email address must be between 1 and 100 characters';
      this.isValid = false;
    } else if (this.user.username.length > 100 || this.user.username.length < 1) {
      this.message = 'Username must be between 1 and 100 characters';
      this.isValid = false;
    } else if (this.password.length > 100) {
      this.message = 'Password must be 100 characters or less';
      this.isValid = false;
    }
    // }

    if (this.isValid) {
      this.validateUsername();
    }

    if (this.isValid) {
      this.validateEmail();
    }

    if (this.isValid) {
      this.validatePassword();
    }
  }

  validateUsername() {
    const sameName = this.users.filter(u => {
      return u.username === this.user.username;
    });

    if (sameName.length) {
      this.message = 'A user with that username already exists';
      this.isValid = false;
    }
  }

  validateEmail() {
    const sameEmail = this.users.filter(u => {
      return u.email === this.user.email;
    });

    const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (sameEmail.length) {
      this.message = 'A user with that email address already exists';
      this.isValid = false;
    } else if (!regex.test(this.user.email)) {
      this.message = 'A valid email address is required';
      this.isValid = false;
    }
  }

  validatePassword() {
    const length = new RegExp('^(?=.{8,})');
    const lower = new RegExp('^(?=.*[a-z])');
    const upper = new RegExp('^(?=.*[A-Z])');
    const numbers = new RegExp('^(?=.*[0-9])');
    const regex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');

    if (!length.test(this.password)) {
      this.message = 'Passwords must be at least 8 characters long';
      this.isValid = false;
    } else if (!lower.test(this.password)) {
      this.message = 'Passwords must contain lowercase letters';
      this.isValid = false;
    } else if (!upper.test(this.password)) {
      this.message = 'Passwords must contain uppercase letters';
      this.isValid = false;
    } else if (!numbers.test(this.password)) {
      this.message = 'Passwords must contain numbers';
      this.isValid = false;
    }

    // if (!regex.test(this.password)) {
    //   this.
    // }
  }
}
