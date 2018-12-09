import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchClaimPage } from './search-claim';

@NgModule({
  declarations: [
    SearchClaimPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchClaimPage),
  ],
})
export class SearchClaimPageModule {}
