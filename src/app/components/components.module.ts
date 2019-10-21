import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListItemComponent } from './list-item/list-item.component';


// making a sharable module
@NgModule({
  declarations: [ListItemComponent], // declaring list item component
  imports: [
    CommonModule, IonicModule // to use ionic modules
  ] ,
  exports : [
    ListItemComponent
  ]
})
export class ComponentsModule { }
