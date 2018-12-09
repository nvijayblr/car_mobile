import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InternalSearchPage } from './internal-search';

@NgModule({
  declarations: [
    InternalSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(InternalSearchPage),
  ],
})
export class InternalSearchPageModule {}
