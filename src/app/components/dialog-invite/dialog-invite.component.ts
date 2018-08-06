import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../models/user';

@Component({
  selector: 'app-dialog-invite',
  templateUrl: './dialog-invite.component.html',
  styleUrls: ['./dialog-invite.component.css']
})
export class DialogInviteComponent implements OnInit {

  allUsers: User[] = [];

  constructor(public dialogRef: MatDialogRef<DialogInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) { }

  ngOnInit() {
    this.allUsers = this.params['allUsers'];
  }

  public onSave(userId: number): void {
    this.dialogRef.close({userId: userId});
  }
}
