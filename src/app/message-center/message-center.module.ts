import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MessageThreadListComponent } from './components/message-thread-list/message-thread-list.component';
import { MessageCenterHomeComponent } from './components/message-center-home/message-center-home.component';
import { MessageCenterRoutingModule } from './message-center-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { MessageThreadItemComponent } from './components/message-thread-item/message-thread-item.component';



@NgModule({
  declarations: [MessageThreadListComponent, MessageCenterHomeComponent, ChatComponent, MessageThreadItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    MessageCenterRoutingModule
  ]
})
export class MessageCenterModule { }
