import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginGuard } from '@spend-book/core/guards/auto-login.guard';

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
