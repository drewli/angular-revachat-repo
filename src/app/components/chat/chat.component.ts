import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Action } from '../../models/action';
import { Message } from '../../models/message';
import { SocketService } from '../../services/socket.service';
import { Event } from '../../models/event';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  action = Action;
  user: User;
  users: User[] = [];
  messages: Message[] = [];
  channelMessages: Message[] = [];
  messageContent: string;
  ioConnection: any;
  channel = 1;

  constructor(private socketService: SocketService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    if (this.user == null) {
      this.router.navigate(['login']);
    } else {
      this.userService.subscribers.next(this.user);
      this.initIoConnection();
    }

    this.userService.getAllUsers().subscribe(u => {
      this.users = u;
    });
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);

        if (message.channel === this.channel) {
          this.channelMessages.push(message);
        }
      });


    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  // ============================= ADD DATABASE CONNECTION =============================
  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    if (message === 'exit') {
      this.socketService.disconnect();
      this.userService.subscribers.next(null);
      sessionStorage.setItem('user', 'none');
      this.router.navigate(['login']);
    }

    this.socketService.send({
      id: 0,
      content: message,
      sender: this.user.id,
      channel: this.channel,
      timestamp: new Date(),
      from: this.user
    });
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        id: 0,
        content: `${this.user.username} ${action}`,
        sender: this.user.id,
        channel: 1,
        timestamp: new Date()
      };
    }
    // else if (action === Action.RENAME) {
    //   message = {
    //     action: action,
    //     content: {
    //       username: this.user.name,
    //       previousUsername: params.previousUsername
    //     }
    //   };
    // }

    this.socketService.send(message);
  }
}
