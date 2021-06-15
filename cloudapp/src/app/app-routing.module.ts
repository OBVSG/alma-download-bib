import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { BibComponent } from './bib/bib.component';
import { HoldingComponent } from './holding/holding.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'bib/:bibId', component: BibComponent },
  { path: 'bib/:bibId/holding/:holdingId', component: HoldingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
