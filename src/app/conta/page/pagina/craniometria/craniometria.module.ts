import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CraniometriaComponent } from './craniometria.component';
import { CraniometriaRoutingModule } from './craniometria-routing.module';

@NgModule({
  declarations: [CraniometriaComponent],
  imports: [CommonModule, FormsModule, ButtonModule, CardModule, DropdownModule, InputNumberModule, InputTextModule, InputTextareaModule, MessageModule, TagModule, TableModule, DialogModule, CraniometriaRoutingModule]
})
export class CraniometriaModule {}
