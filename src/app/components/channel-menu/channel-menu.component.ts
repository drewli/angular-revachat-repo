import { Component, OnInit, Inject } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { MatDialogRef, MatDialog } from '@angular/material';
import { DialogChannelComponent } from '../dialog-channel/dialog-channel.component';
import { DialogChannelType } from '../dialog-channel/dialog-channel-type';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-channel-menu',
  templateUrl: './channel-menu.component.html',
  styleUrls: ['./channel-menu.component.css']
})
export class ChannelMenuComponent implements OnInit {

  user: User;
  channels: Channel[];
  dialogRef: MatDialogRef<DialogChannelComponent> | null;

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
  // defaultDialogParams: any = {
  //   disableClose: true,
  //   data: {
  //     title: 'New Channel',
  //     channelType: DialogChannelType.PUBLIC
  //   }
  // };

  constructor(
    private channelService: ChannelService,
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.channelService.allChannels.subscribe(channels => {
      this.channels = channels;
    });

    this.userService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  openChannelPopup(params: any) {
    // this.dialogRef = this.dialog.open(DialogChannelComponent, params);
    // this.dialogRef.afterClosed().subscribe(paramsDialog => {
    //   if (!paramsDialog) {
    //     return;
    //   }

    //   const channel: Channel = {
    //     isDirectMessaging: (paramsDialog.channelType === DialogChannelType.PUBLIC) ? 'false' : 'true',
    //     channelName: paramsDialog.channelName
    //   };

    //   console.log(channel);
    //   // this.user.name = paramsDialog.username;
    //   // if (paramsDialog.dialogType === DialogUserType.NEW) {
    //   //   this.initIoConnection();
    //   //   this.sendNotification(paramsDialog, Action.JOINED);
    //   // } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
    //   //   this.sendNotification(paramsDialog, Action.RENAME);
    //   // }
    // });
  }

  changeChannel(channelId: number) {
    console.log(channelId);
  }

}
