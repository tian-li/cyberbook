import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { fromUI } from '@spend-book/core/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  themeName: string;

  constructor(private store: Store, private overlayContainer: OverlayContainer) {}

  ngOnInit() {
    this.store.pipe(
      select(fromUI.selectThemeName)
    ).subscribe((themeName) => {
      this.themeName = themeName;
      const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item.includes('-theme'));
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(themeName);
    });
  }
}
