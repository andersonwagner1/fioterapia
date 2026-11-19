import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CraniometriaComponent } from './craniometria.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: CraniometriaComponent }])],
  exports: [RouterModule]
})
export class CraniometriaRoutingModule {}
