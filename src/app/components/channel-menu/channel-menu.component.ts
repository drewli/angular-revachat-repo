import { Component, OnInit, Inject } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogChannelComponent } from '../dialog-channel/dialog-channel.component';
import { DialogChannelType } from '../dialog-channel/dialog-channel-type';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ChannelMembershipService } from '../../services/channel-membership.service';
import { ChannelMembership } from '../../models/channel-membership';
import { DialogErrorComponent } from '../dialog-error/dialog-error.component';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-channel-menu',
  templateUrl: './channel-menu.component.html',
  styleUrls: ['./channel-menu.component.css']
})
export class ChannelMenuComponent implements OnInit {

  user: User;
  channels: Channel[];
  channelMemberships: ChannelMembership[];
  dialogRef: MatDialogRef<DialogChannelComponent> | null;
  dialogErrorRef: MatDialogRef<DialogErrorComponent> | null;

  publicParams = {
    data: {
      title: 'New Channel',
      channelType: DialogChannelType.PUBLIC,
      creator: this.user
    }
  };

  // privateParams = {
  //   data: {
  //     title: 'New Direct Message',
  //     channelType: DialogChannelType.PRIVATE,
  //     creator: this.user
  //   }
  // };

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    private membershipService: ChannelMembershipService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.channelService.allChannels.subscribe(channels => {
      this.channels = channels;
    });

    if (sessionStorage.length) {
      this.user = JSON.parse(sessionStorage.getItem('user'));
    }

    this.membershipService.channelMemberships.subscribe(memberships => {
      this.channelMemberships = memberships;
    });
    this.membershipService.loadChannelMemberships();
  }

  openChannelPopup(params: any) {
    this.dialogRef = this.dialog.open(DialogChannelComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      const channel: Channel = {
        isDirectMessaging: (paramsDialog.channelType === DialogChannelType.PUBLIC) ? 'false' : 'true',
        channelName: paramsDialog.channelName
      };

      if (!channel.channelName) {
        console.log('[LOG] - Empty channel name');
        return;
      }

      console.log(channel);
      this.createChannel(channel);

      // this.user.name = paramsDialog.username;
      // if (paramsDialog.dialogType === DialogUserType.NEW) {
      //   this.initIoConnection();
      //   this.sendNotification(paramsDialog, Action.JOINED);
      // } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
      //   this.sendNotification(paramsDialog, Action.RENAME);
      // }
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
              console.log(result);
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

  changeChannel(channelId: number) {
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

}


// [
//   {
//       "channelMembershipId": 2,
//       "channelUserId": 1,
//       "channelUserRole": "admin",
//       "channelId": 1
//   }
// ]
