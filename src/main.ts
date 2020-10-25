import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { enableProdMode, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
registerLocaleData(zh);

platformBrowserDynamic().bootstrapModule(AppModule,
  { providers: [{ provide: LOCALE_ID, useValue: 'zh' }] }
)
.catch(err => console.error(err));
