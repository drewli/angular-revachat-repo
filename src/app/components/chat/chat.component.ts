import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  allUsers = {};
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
    private messageService: MessageService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (!sessionStorage.length) {
      this.userService.currentUser.next(null);
      this.router.navigate(['login']);
    }

    this.initIoConnection();

    this.user = JSON.parse(sessionStorage.getItem('user'));
    console.log(this.user);

    this.userService.allUsers.subscribe(users => {
      users.forEach(
        user => {
          this.allUsers[user.userId] = user;
        }
      );
    });

    this.channelService.channel.subscribe(channel => {
      this.channel = channel;
      this.messageService.loadMessages();
      this.channelMessages = this.messages.filter(
        message => {
          return message.messageChannelId === channel.channelId;
        }
      );

      // detectChanges makes angular look at the current view and its children elements
      // to dectect any changes in their properties. Wee need to use it here because when
      // the channel is changed, it changes the number of messages that are being displayed.
      // When the number of diaplayed messages changes, it changes the scrollTop property
      // of the ol without letting angular know. Angular then detects that the property was
      // changed unexpectedly and throws an error.
      this.cd.detectChanges();
    });

    this.messageService.messages.subscribe(messages => {
      if (messages) {
        // To improve performance, we'll only process messages that aren't already in the cache
        console.log(`Number of messages retrieved from database: ${messages.length}`);

        // Get the number of new messages
        const numNew = messages.length - this.messages.length;
        console.log(`Number of new messages: ${numNew}`);

        // Create an array containing only the new messages
        const newMessages = messages.slice(messages.length - numNew);

        // Attach a reference on each message to the user object that created it
        newMessages.forEach(
          message => {
            message.from = this.allUsers[message.messageSenderId];

            if (message.messageChannelId === this.channel.channelId) {
              this.channelMessages.push(message);
            }
          }
        );

        this.messages = this.messages.concat(newMessages);
      }
    });
    this.messageService.loadMessages();
  }

  private initIoConnection(): void {
    console.log('[LOG] - In ChatComponent.initIoConnection()');
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        if (message.messageChannelId !== -1) {
          this.messages.push(message);
        }

        if (message.messageChannelId === this.channel.channelId) {
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
      sessionStorage.clear();
      this.router.navigate(['login']);
    }

    const chatMessage: Message = {
      messageId: 0,
      messageContent: message,
      messageSenderId: this.user.userId,
      messageChannelId: this.channel.channelId,
      messageTimestamp: new Date(),
      from: this.user
    };

    this.messageContent = null;
    this.socketService.send(chatMessage);

    if (this.channel.channelId === -1){return;}

    this.messageService.createMessage(chatMessage).subscribe(result => {
      console.log(result);
    });

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
