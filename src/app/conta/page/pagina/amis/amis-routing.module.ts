import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AmisComponent } from './amis.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: AmisComponent }])],
  exports: [RouterModule]
})
export class AmisRoutingModule {}
