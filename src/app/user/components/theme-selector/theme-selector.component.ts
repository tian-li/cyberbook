import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromUI, fromUser } from '@cyberbook/core/store';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss']
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {

  readonly themes = [
    {
      name: 'deeppurple-amber-theme',
      primary: '#673ab7',
      accent: '#ffd740',
      isDark: false,
    },
    {
      name: 'indigo-pink-theme',
      primary: '#3f51b5',
      accent: '#ff4081',
      isDark: false,
    },
    {
      name: 'pink-bluegrey-theme',
      primary: '#c2185b',
      accent: '#b0bec5',
      isDark: true,
    },
    {
      name: 'purple-green-theme',
      primary: '#7b1fa2',
      accent: '#69f0ae',
      isDark: true,
    },
    {
      name: 'cyberpunk-2077-theme',
      primary: '#FCEE0A',
      accent: '#02D7F2',
      isDark: true,
    }
  ];

  previousTheme: string;
  selectedTheme: string;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.store.dispatch(fromUI.hideToolbar());

    this.store.pipe(
      select(fromUser.selectTheme),
      take(1)
    ).subscribe(theme => {
      this.previousTheme = theme;
      this.selectedTheme = theme;
    });
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
  }

  selectTheme(theme: string) {
    this.selectedTheme = theme;
    this.store.dispatch(fromUser.savePreferredTheme({ theme }));
  }

  save() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  cancel() {
    this.store.dispatch(fromUser.savePreferredTheme({ theme: this.previousTheme }));
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
