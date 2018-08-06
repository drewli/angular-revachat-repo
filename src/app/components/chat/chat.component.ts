import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
import { InviteService } from '../../services/invite.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
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
    private inviteService: InviteService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    if (!sessionStorage.length) {
      this.router.navigate(['login']);
    }

    this.channelService.channel.next(this.channelService.generalChat);

    this.user = JSON.parse(sessionStorage.getItem('user'));
    console.log(this.user);

    this.userService.allUsers.subscribe(users => {
      users.forEach(
        user => {
          if (!this.allUsers[user.userId]) {
            this.allUsers[user.userId] = user;
          }
        }
      );
    });
    this.userService.loadUsers();

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

    this.initIoConnection();
  }

  ngOnDestroy() {
    this.cd.detach();
    // if (!!this.userService.allUsers) {
    //   this.userService.allUsers.unsubscribe();
    // }

    // if (!!this.channelService.channel) {
    //   this.channelService.channel.unsubscribe();
    // }

    // if (!!this.messageService.messages) {
    //   this.messageService.messages.unsubscribe();
    // }
  }

  private initIoConnection(): void {
    console.log('[LOG] - In ChatComponent.initIoConnection()');
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        // Is it a notification?
        if (message.messageChannelId === -2) {
          // Is it for us?
          if (parseInt(message.messageContent) === this.user.userId) {
            // Is it an invitation to another channel?
            if (message.action === Action.INVITE) {
              // Reload invites and channels
              this.channelService.loadChannels();
              this.inviteService.loadInvites();
            }
          }
        }

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

  toScroll() {
    const chatList = document.getElementById('chat-list');
    if (chatList.offsetHeight + chatList.scrollTop + 64 >= chatList.scrollHeight) {
      return chatList.scrollHeight;
    }
    return chatList.scrollTop;
  }

  private getRandomAvatar(): string {
    return `https://api.adorable.io/avatars/${Math.floor(Math.random() * (1000000)) + 1}`;
  }
}
