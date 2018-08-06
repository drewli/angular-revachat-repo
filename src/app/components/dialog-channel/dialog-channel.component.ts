import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-channel',
  templateUrl: './dialog-channel.component.html',
  styleUrls: ['./dialog-channel.component.css']
})
export class DialogChannelComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) { }

  ngOnInit() {
  }

  // Close the dialog box and return the name of the new channel
  public onSave(name: string): void {
    this.dialogRef.close({channelType: this.params.channelType, channelName: name});
  }
}
