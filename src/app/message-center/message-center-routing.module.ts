import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadDataResolver } from '../core/reslovers/load-data.resolver';
import { ChatComponent } from './components/chat/chat.component';
import { MessageCenterHomeComponent } from './components/message-center-home/message-center-home.component';
import { MessageThreadListComponent } from './components/message-thread-list/message-thread-list.component';

const routes: Routes = [
  {
    path: '',
    component: MessageCenterHomeComponent,
    // resolve: { data: LoadDataResolver },
    children: [
      {
        path: 'list',
        component: MessageThreadListComponent
      },
      {
        path: 'message-thread/:messageThreadId',
        component: ChatComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageCenterRoutingModule {
}
