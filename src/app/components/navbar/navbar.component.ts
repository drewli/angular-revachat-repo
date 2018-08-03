import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
    this.userService.currentUser.next(null);
  }
}
