import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {
  user: User;
  users: User[] = [];
  password: string;
  message: string;
  isValid = true;
  updatedInfo = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    if (!this.user) {
      this.router.navigate(['login']);
    }
  
    this.userService.allUsers.subscribe(users => {
      this.users = users;
    });

    this.userService.loadUsers();
  }

  updateAccountInfo() {
    console.log('update');
    this.message = '';

    /* if (!this.validatePassword()) {
      this.message = 'Incorrect Password';
      return;
    } */

    const sameName = this.users.filter(u => {
      return u.username === this.user.username && u.userId !== this.user.userId;
    })

    if (sameName.length) {
      this.message = 'Another user is already using that username';
    } else {
      console.log(this.user);
      this.userService.updateUser(this.user).subscribe(user => console.log(user));
      // TODO: Update the info for cognito.
      this.updatedInfo = true;
    }
  }

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
    } else if (this.user.username.length > 100 || this.user.username.length < 1) {
      this.message = 'Username must be between 1 and 100 characters';
      this.isValid = false;
    }
    // }
    if (this.isValid) {
      this.validateUsername();
    }
  }

  validateUsername() {
    const sameName = this.users.filter(u => {
      return u.username === this.user.username && u.userId !== this.user.userId;
    });

    if (sameName.length) {
      this.message = 'A user with that username already exists';
      this.isValid = false;
    }
  }

  validatePassword(): boolean {
    // TODO: Validate account based on password in cognito.
    return false;
  }
}