import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogChannelComponent } from '../dialog-channel/dialog-channel.component';
import { DialogChannelType } from '../dialog-channel/dialog-channel-type';
import { ChannelMembershipService } from '../../services/channel-membership.service';
import { ChannelMembership } from '../../models/channel-membership';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { SocketService } from '../../services/socket.service';
import { Router } from '@angular/router';
import { DialogInviteComponent } from '../dialog-invite/dialog-invite.component';
import { Invite } from '../../models/invite';
import { InviteService } from '../../services/invite.service';
import { DialogViewInviteComponent } from '../dialog-view-invite/dialog-view-invite.component';
import { Action } from '../../models/action';
import { Message } from '../../models/message';
import { DialogDirectMessageComponent } from '../dialog-direct-message/dialog-direct-message.component';
import { DialogAccountComponent } from '../dialog-account/dialog-account.component';

@Component({
  selector: 'app-channel-menu',
  templateUrl: './channel-menu.component.html',
  styleUrls: ['./channel-menu.component.css']
})
export class ChannelMenuComponent implements OnInit, OnDestroy {

  user: User;
  allUsers2: User[] = [];
  channel: Channel;
  channels: Channel[];
  channelMemberships: ChannelMembership[];
  userChannels: Channel[] = [this.channelService.generalChat];
  userDirectMessages: Channel[] = [];
  invites: Invite[] = [];
  userInvites: Invite[] = [];
  dialogRef: MatDialogRef<DialogChannelComponent> | null;
  dialogErrorRef: MatDialogRef<DialogErrorComponent> | null;
  dialogInviteRef: MatDialogRef<DialogInviteComponent> | null;
  dialogViewInviteRef: MatDialogRef<DialogViewInviteComponent> | null;
  dialogDirectMessageRef: MatDialogRef<DialogDirectMessageComponent> | null;
  dialogAccountRef: MatDialogRef<DialogAccountComponent> | null;

  publicParams = {
    data: {
      title: 'New Channel',
      channelType: DialogChannelType.PUBLIC,
      creator: this.user
    }
  };

  constructor(
    private channelService: ChannelService,
    private membershipService: ChannelMembershipService,
    private socketService: SocketService,
    private userService: UserService,
    private inviteService: InviteService,
    private router: Router,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.user = JSON.parse(sessionStorage.getItem('user'));

    this.userService.allUsers.subscribe(users => {
      this.allUsers2 = users.filter(
        user => {
          return user.userId !== this.user.userId;
        }
      );
    });
    this.userService.loadUsers();

    this.membershipService.channelMemberships.subscribe(memberships => {
      this.channelMemberships = memberships;
      this.userDirectMessages = [];

      this.channelMemberships.forEach(
        membership => {
          if (membership.channelUserId === this.user.userId) {
            const sameChannel = this.userChannels.filter(
              channel => {
                return channel.channelId === membership.channelId;
              }
            );

            if (!sameChannel.length) {
              this.channelService.getChannelById(membership.channelId).subscribe(
                channel => {
                  if (channel.isDirectMessaging) {
                    if (channel.isDirectMessaging !== this.user.username) {
                      channel.channelName = channel.isDirectMessaging;
                    }
                    this.userDirectMessages.push(channel);
                  } else {
                    this.userChannels.push(channel);
                  }
                }
              );
            }
          }
        }
      );

      this.userChannels.forEach(
        (channel, index) => {
          const membershipArray = this.channelMemberships.filter(
            membership => {
              return membership.channelUserId === this.user.userId && membership.channelId === channel.channelId;
            }
          );

          if (!membershipArray.length && channel.channelId !== -1) {
            this.userChannels.splice(index);
          }
        }
      );
    });
    this.membershipService.loadChannelMemberships();

    this.channelService.allChannels.subscribe(channels => {
      this.channels = channels;
    });
    this.channelService.loadChannels();

    this.channelService.channel.subscribe(
      channel => {
        this.channel = channel;
      }
    );

    this.inviteService.invites.subscribe(
      invites => {
        this.invites = invites;
        this.userInvites = invites.filter(
          invite => {
            return invite.invitedUserId === this.user.userId;
          }
        );
      }
    );
    this.inviteService.loadInvites();
  }

  ngOnDestroy() {
    this.cd.detach();
  }

  openAccountPopup() {
    this.dialogAccountRef = this.dialog.open(DialogAccountComponent, {});
  }

  openChannelPopup(params: any) {
    this.dialogRef = this.dialog.open(DialogChannelComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      const channel: Channel = {
        isDirectMessaging: '',
        channelName: paramsDialog.channelName
      };

      if (!channel.channelName) {
        console.log('[LOG] - Empty channel name');
        return;
      }

      console.log(channel);
      this.createChannel(channel);
    });
  }

  openInvitePopup(channelId: number) {
    this.inviteService.loadInvites();
    const memberships = this.channelMemberships.filter(
      membership => {
        return membership.channelId === channelId;
      }
    );

    const members = [];
    memberships.forEach(
      membership => {
        members.push(membership.channelUserId);
      }
    );

    const eligible: User[] = this.allUsers2.filter(
      user => {
        return !members.includes(user.userId);
      }
    );

    const params = {
      data: {
        channelId: channelId,
        allUsers: eligible
      }
    };
    this.dialogInviteRef = this.dialog.open(DialogInviteComponent, params);
    this.dialogInviteRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      const invite: Invite = {
        invitedUserId: paramsDialog.userId,
        inviteChannelId: this.channel.channelId
      };

      if (!invite.invitedUserId) {
        console.log('[LOG] - No user selected');
        return;
      }

      console.log(invite);
      this.inviteService.createInvite(invite).subscribe(
        result => {
          console.log(result);
          this.sendNotification({invitedUserId: invite.invitedUserId}, Action.INVITE);
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  viewInvite(invite: Invite) {
    const inviteChannel = this.channels.filter(
      channel => {
        return channel.channelId === invite.inviteChannelId;
      }
    )[0];
    const params = {
      data: {
        channelName: inviteChannel.channelName
      }
    };
    this.dialogViewInviteRef = this.dialog.open(DialogViewInviteComponent, params);
    this.dialogViewInviteRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      if (paramsDialog['accepted']) {
        const membership: ChannelMembership = {
          channelUserId: invite.invitedUserId,
          channelId: invite.inviteChannelId,
          channelUserRole: 'user'
        };

        this.membershipService.createChannelMembership(membership).subscribe(
          result => {
            this.membershipService.loadChannelMemberships();
          }
        );
      }

      this.inviteService.deleteInvite(invite.inviteId).subscribe(
        result => {
          this.inviteService.loadInvites();
          this.membershipService.loadChannelMemberships();
        }
      );
    });
  }

  createChannel(channel: Channel) {
    this.channelService.createChannel(channel).subscribe(
      result => {
        if (result) {
          channel = result;
          console.log(`Result: ${result}`);
          this.channelService.loadChannels();

          const membership: ChannelMembership = {
            channelUserId: this.user.userId,
            channelId: channel.channelId,
            channelUserRole: 'admin'
          };

          this.membershipService.createChannelMembership(membership).subscribe(
            result => {
              this.membershipService.loadChannelMemberships();
            },
            error => {
              console.log(error);
            }
          );
        }
      },
      error => {
        this.openErrorPopup('A channel with that name already exists');
      }
    );
  }

  openErrorPopup(message: string) {
    const params = {
      data: {
        message: message
      }
    };
    this.dialogErrorRef = this.dialog.open(DialogErrorComponent, params);
  }

  openDMPopup() {
    const currentDM = [];

    this.userDirectMessages.forEach(
      channel => {
        currentDM.push(channel.channelId);
      }
    );

    const currentDMUsers = [];

    this.channelMemberships.forEach(
      membership => {
        if (currentDM.includes(membership.channelId)) {
          currentDMUsers.push(membership.channelUserId);
        }
      }
    );

    const eligibleUsers = this.allUsers2.filter(
      user => {
        return !currentDMUsers.includes(user.userId) && user.userId !== this.user.userId;
      }
    );

    const params = {
      data: {
        allUsers: eligibleUsers
      }
    };

    this.dialogDirectMessageRef = this.dialog.open(DialogDirectMessageComponent, params);
    this.dialogDirectMessageRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      const user = eligibleUsers.filter(
        u => {
          return u.userId === parseInt(paramsDialog.userId);
        }
      )[0];

      console.log(user);

      let channel: Channel = {
        isDirectMessaging: this.user.username,
        channelName: user.username
      };
      console.log(channel);

      this.channelService.createChannel(channel).subscribe(
        result => {
          this.channelService.loadChannels();
          channel = result;
          console.log(channel);

          const membership: ChannelMembership = {
            channelUserId: this.user.userId,
            channelId: channel.channelId,
            channelUserRole: 'user'
          };

          this.membershipService.createChannelMembership(membership).subscribe(
            result => {
              this.membershipService.loadChannelMemberships();
              console.log(result);

              const invite: Invite = {
                invitedUserId: user.userId,
                inviteChannelId: channel.channelId
              };

              console.log(invite);

              this.inviteService.createInvite(invite).subscribe(
                result => {
                  console.log(result);
                  this.sendNotification({invitedUserId: invite.invitedUserId}, Action.INVITE);
                },
                error => {
                  console.log(error);
                }
              );
            }
          );
        }
      );
    });
  }

  changeChannel(channelId: number) {
    console.log(channelId);
    if (channelId === -1) {
      this.channelService.channel.next(this.channelService.generalChat);
      return;
    }

    const newChannel = this.channels.filter(value => {
      return value.channelId === channelId;
    })[0];

    console.log(newChannel);

    this.channelService.channel.next(newChannel);
  }

  getColor(channelId: number): string {
    if (this.channel.channelId === channelId) {
      return 'primary';
    }
    return 'accent';
  }

  isDisabled(): boolean {
    if (this.channel.channelId === -1) {
      return true;
    }

    if (this.channel.isDirectMessaging) {
      return true;
    }

    const membership = this.channelMemberships.filter(
      mem => {
        return mem.channelUserId === this.user.userId && mem.channelId === this.channel.channelId;
      }
    )[0];

    return !(membership.channelUserRole === 'admin');
  }

  public sendNotification(params: any, action: Action): void {
    console.log('[LOG] - In ChannelMenuComponent.sendNotification()');
    let message: Message;

    if (action === Action.INVITE) {
      message = {
        messageChannelId: -2,
        messageContent: params.invitedUserId,
        messageSenderId: this.user.userId,
        messageTimestamp: new Date(),
        action: Action.INVITE
      };
    }

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

  logout() {
    sessionStorage.clear();
    this.socketService.disconnect();
    this.router.navigate(['login']);
  }
}
