import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AmisRoutingModule } from './amis-routing.module';
import { AmisComponent } from './amis.component';

@NgModule({
  declarations: [AmisComponent],
  imports: [CommonModule, FormsModule, AmisRoutingModule]
})
export class AmisModule {}
