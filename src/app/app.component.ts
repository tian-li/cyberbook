import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { fromUI, fromUser } from '@cyberbook/core/store';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  theme: string;
  loading: boolean;

  private unsubscribe$ = new Subject();

  constructor(private store: Store, private overlayContainer: OverlayContainer,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private renderer: Renderer2) {
    this.matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/github.svg')
    );
  }

  ngOnInit() {
    this.store.pipe(
      select(fromUser.selectTheme),
      takeUntil(this.unsubscribe$)
    ).subscribe((theme) => {
      this.renderer.addClass(document.body, theme);
      this.renderer.removeClass(document.body, this.theme);
      this.theme = theme;
      const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
      const themeClassesToRemove = Array.from(overlayContainerClasses).filter(
        (item: string) => item.includes('-theme')
      );
      if (themeClassesToRemove.length) {
        overlayContainerClasses.remove(...themeClassesToRemove);
      }
      overlayContainerClasses.add(theme);
    });

    this.store.pipe(
      select(fromUI.selectLoading),
      debounceTime(200),
      takeUntil(this.unsubscribe$)
    ).subscribe((loading: boolean) => this.loading = loading);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
