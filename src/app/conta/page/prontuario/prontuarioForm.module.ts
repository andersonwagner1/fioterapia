import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';

import { ProntuarioFormRoutingModule } from './prontuarioForm-routing.module';
import { ProntuarioFormComponent } from './prontuarioForm.component';
import { PanelModule } from 'primeng/panel';
import { TabViewModule } from 'primeng/tabview'; 
// Aproveite e verifique se o Calendar e o InputNumber que usamos também estão aqui:
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [
        CommonModule,
        ProntuarioFormRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        InputMaskModule,
        PanelModule,
        TabViewModule,      // <-- Adicione aqui
    CalendarModule,     // <-- Adicione aqui para o campo de datas funcionar
    DropdownModule,     // <-- Adicione aqui para o sexo
    InputNumberModule   // <-- Adicione aqui para o peso/comprimento
    ],
    declarations: [ProntuarioFormComponent]
})
export class ProntuarioFormModule { }


