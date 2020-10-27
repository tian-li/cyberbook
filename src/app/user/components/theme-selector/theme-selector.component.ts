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
      name: 'cyberpunk-2077-theme',
      displayName: '赛博朋克 2077',
      primary: '#FCEE0A',
      accent: '#02D7F2',
      isDark: true,
    },
    {
      name: 'blade-runner-2049-theme',
      displayName: '银翼杀手 2049',
      primary: '#EEBE46',
      accent: '#E88935',
      isDark: false,
    },
    {
      name: 'seasons-spring-theme',
      displayName: '春',
      primary: '#669D31',
      accent: '#B2C449',
      isDark: false,
    },
    {
      name: 'seasons-summer-theme',
      displayName: '夏',
      primary: '#0487D9',
      accent: '#F2E5D5',
      isDark: false,
    },
    {
      name: 'seasons-autumn-theme',
      displayName: '秋',
      primary: '#D95323',
      accent: '#F2A30F',
      isDark: false,
    },
    {
      name: 'seasons-winter-theme',
      displayName: '冬',
      primary: '#6085A6',
      accent: '#BBE8F2',
      isDark: false,
    },
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
