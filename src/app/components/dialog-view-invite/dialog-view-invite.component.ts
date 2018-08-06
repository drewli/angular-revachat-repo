import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-view-invite',
  templateUrl: './dialog-view-invite.component.html',
  styleUrls: ['./dialog-view-invite.component.css']
})
export class DialogViewInviteComponent implements OnInit {

  channelName: string;

  constructor(public dialogRef: MatDialogRef<DialogViewInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) { }

  ngOnInit() {
    this.channelName = this.params['channelName'];
  }

  public onSave(response: boolean): void {
    this.dialogRef.close({accepted: response});
  }
}
