import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-account',
  templateUrl: './dialog-account.component.html',
  styleUrls: ['./dialog-account.component.css']
})
export class DialogAccountComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public params: any) { }

  ngOnInit() {
  }

}
