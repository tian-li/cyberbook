import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LedgerHomeComponent } from './components/ledger-home/ledger-home.component';

const routes: Routes = [
  {
    path: '',
    component: LedgerHomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LedgerRoutingModule {}
