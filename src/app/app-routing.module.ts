import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      // preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
