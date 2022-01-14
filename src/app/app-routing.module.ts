import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginGuard } from '@cyberbook/core/guards/auto-login.guard';
import { ImageEditorComponent } from '@cyberbook/shared/components/image-editor/image-editor.component';
import { ImageEditorGuard } from './core/guards/image-editor.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AutoLoginGuard],
    //
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'image-editor',
        component: ImageEditorComponent,
        canActivate: [ImageEditorGuard],
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./user/user.module').then(m => m.UserModule)
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./book/book.module').then(m => m.BookModule)
      },
      {
        path: 'graph',
        loadChildren: () =>
          import('./graph/graph.module').then(m => m.GraphModule)
      },
      {
        path: 'message-center',
        loadChildren: () =>
          import('./message-center/message-center.module').then(m => m.MessageCenterModule)
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      // enableTracing: true
      // preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
