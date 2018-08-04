import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-channel',
  templateUrl: './dialog-channel.component.html',
  styleUrls: ['./dialog-channel.component.css']
})
export class DialogChannelComponent implements OnInit {
  channelNameFormControl = new FormControl('', Validators.required);

  constructor(public dialogRef: MatDialogRef<DialogChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) { }

  ngOnInit() {
  }

  // Close the dialog box and return the name of the new channel
  public onSave(): void {
    this.dialogRef.close({
      channelName: this.params.channelName
    });
  }
}
