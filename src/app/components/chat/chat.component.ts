import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Action } from '../../models/action';
import { Message } from '../../models/message';
import { SocketService } from '../../services/socket.service';
import { Event } from '../../models/event';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Channel } from '../../models/channel';
import { ChannelService } from '../../services/channel.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  action = Action;
  user: User;
  messages: Message[] = [];
  channelMessages: Message[] = [];
  messageContent: string;
  ioConnection: any;
  channel: Channel;

  constructor(
    private router: Router,
    private socketService: SocketService,
    private userService: UserService,
    private channelService: ChannelService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    console.log('[LOG] - In ChatComponent.ngOnInit()');
    this.userService.currentUser.subscribe(user => {
      if (user == null) {
        this.router.navigate(['login']);
      } else {
        this.user = user;
        this.initIoConnection();
      }
    });

    this.channelService.channel.subscribe(channel => {
      this.channel = channel;
    });

    this.messageService.messages.subscribe(messages => {
      this.messages = messages;
    });
    this.messageService.loadMessages();
  }

  private initIoConnection(): void {
    console.log('[LOG] - In ChatComponent.initIoConnection()');
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);

        if (message.messageChannelId === this.channel.id) {
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

  public sendMessage(message: string): void {
    console.log('[LOG] - In ChatComponent.sendMessage()');
    if (!message) {
      return;
    }

    if (message === 'exit') {
      this.socketService.disconnect();
      this.userService.currentUser.next(null);
      sessionStorage.setItem('user', 'none');
      this.router.navigate(['login']);
    }

    const chatMessage: Message = {
      messageId: 0,
      messageContent: message,
      messageSenderId: this.user.userId,
      messageChannelId: this.channel.id,
      messageTimestamp: new Date(),
      from: this.user
    };

    this.messageService.createMessage(chatMessage).subscribe(result => {
      console.log(result);
    });
    this.socketService.send(chatMessage);
    this.messageContent = null;
  }

  public sendNotification(params: any, action: Action): void {
    console.log('[LOG] - In ChatComponent.sendNotification()');
    let message: Message;

    // if (action === Action.JOINED) {
    //   message = {
    //     id: 0,
    //     content: `${this.user.username} ${action}`,
    //     sender: this.user.id,
    //     channel: 1,
    //     timestamp: new Date()
    //   };
    // }
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
