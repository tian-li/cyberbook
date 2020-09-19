import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromUI } from '@cyberbook/core/store';
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
    }
  ]

  previousTheme;
  selectedTheme;

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
      select(fromUI.selectThemeName),
      take(1)
    ).subscribe(themeName => {
      this.previousTheme = themeName;
      this.selectedTheme = themeName;
    });


  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
  }

  selectTheme(themeName: string) {
    this.selectedTheme = themeName;
    this.store.dispatch(fromUI.setTheme({themeName}));
  }

  save() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  cancel() {
    this.store.dispatch(fromUI.setTheme({ themeName: this.previousTheme }));
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
