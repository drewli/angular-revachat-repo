import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-channel-menu',
  templateUrl: './channel-menu.component.html',
  styleUrls: ['./channel-menu.component.css']
})
export class ChannelMenuComponent implements OnInit {

  user: User;
  channels: Channel[];

  constructor(
    private channelService: ChannelService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.channelService.allChannels.subscribe(channels => {
      this.channels = channels;
    });

    this.userService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  changeChannel(channelId: number) {
    console.log(channelId);
  }

}
