import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { notifyWithSnackBar } from '../../../core/store/notification/notification.actions';

@Component({
  selector: 'app-book-home',
  templateUrl: './book-home.component.html',
  styleUrls: ['./book-home.component.scss']
})
export class BookHomeComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {
  }

  notify() {
    this.store.dispatch(notifyWithSnackBar({snackBar: {message: 'this is a snack bar'}}))
  }

}
