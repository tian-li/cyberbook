import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageUploadService } from '@cyberbook/core/services/image-upload.service';
import { fromUI, fromUser } from '@cyberbook/core/store';
import { defaultTheme, UploadStatus } from '@cyberbook/shared/constants';
import { getLocalStorageValueByKey } from '@cyberbook/shared/utils/get-localstorage-value-by-key';
import { select, Store } from '@ngrx/store';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  theme: string = '';
  loading: boolean = false;
  isWeChat: boolean = false;

  showUploadProgress = false;
  finished = false;
  uploadProgress = 0;

  private unsubscribe$ = new Subject();

  constructor(private store: Store, private overlayContainer: OverlayContainer,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private imageUploadService: ImageUploadService,
              private renderer: Renderer2) {
    this.matIconRegistry.addSvgIcon(
      'github',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/github.svg')
    );
  }

  ngOnInit() {
    combineLatest([
      this.imageUploadService.progress$,
      this.imageUploadService.status$
    ]).subscribe(([progress, status]: [number, UploadStatus]) => {
      this.finished = progress === 100 && status === UploadStatus.Finished;
      this.uploadProgress = progress;

      if(status === UploadStatus.InProgress) {
        this.showUploadProgress = true;
      }
      if(status === UploadStatus.Finished) {
        setTimeout(() => {
          this.showUploadProgress = false;
        }, 700);
      }
    });

    this.store.select(fromUI.selectIsWeChat).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(isWeChat => {
      this.isWeChat = isWeChat;
    });

    combineLatest([
      this.store.pipe(select(fromUser.selectTheme)),
      this.getLocalTheme()
    ])
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(([userTheme, localTheme]: [null | string, null | string]) => {
      const theme = userTheme ?? localTheme ?? defaultTheme;

      if (theme !== this.theme) {
        this.setTheme(theme);
      }
    });

    this.store.pipe(
      select(fromUI.selectLoading),
      debounceTime(500),
      takeUntil(this.unsubscribe$)
    ).subscribe((loading: boolean) => this.loading = loading);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getLocalTheme(): Observable<string | null> {
    return of(getLocalStorageValueByKey('theme'));
  }

  private setTheme(theme: string) {
    this.renderer.addClass(document.body, theme);

    if(this.theme) {
      this.renderer.removeClass(document.body, this.theme);
    }

    this.theme = theme;
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter(
      (item: string) => item.includes('-theme')
    );
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(theme);
  }
}
