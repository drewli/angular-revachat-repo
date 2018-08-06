import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: User;

  constructor(private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    if (sessionStorage.length) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }
  }
}
