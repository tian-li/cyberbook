import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LedgerHomeComponent } from './components/ledger-home/ledger-home.component';
import { LedgerRoutingModule } from './ledger-routing.module';

@NgModule({
  declarations: [LedgerHomeComponent],
  imports: [
    CommonModule,
    LedgerRoutingModule
  ]
})
export class LedgerModule { }
