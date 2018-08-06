import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/user';

@Component({
  selector: 'app-dialog-direct-message',
  templateUrl: './dialog-direct-message.component.html',
  styleUrls: ['./dialog-direct-message.component.css']
})
export class DialogDirectMessageComponent implements OnInit {

  allUsers: User[] = [];

  constructor(public dialogRef: MatDialogRef<DialogDirectMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) { }

  ngOnInit() {
    this.allUsers = this.params['allUsers'];
  }

  public onSave(userId: number): void {
    console.log(userId);
    this.dialogRef.close({userId: userId});
  }
}
