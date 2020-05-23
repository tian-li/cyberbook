import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';
import { fromUI, fromUser } from '@spend-book/core/store';
import { hideToolbar } from '@spend-book/core/store/ui';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit {
  user: User;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(fromUser.selectUser)
    ).subscribe((user: User) => {
      this.user = user;
    })
  }

  gotoAccountDetail() {
    if (this.user.registered) {
      this.router.navigate(['./profile']);
    } else {
      this.router.navigate(['./login'], {relativeTo: this.route, state:{data: {hideNavBar: true}}});
    }
  }

}
