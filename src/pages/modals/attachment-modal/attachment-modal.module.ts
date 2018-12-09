import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttachmentModalPage } from './attachment-modal';

@NgModule({
  declarations: [
    AttachmentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AttachmentModalPage),
  ],
})
export class AttachmentModalPageModule {}
