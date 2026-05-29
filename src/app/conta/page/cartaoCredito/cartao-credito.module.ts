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
import { CartaoCreditoRoutingModule } from './cartao-credito-routing.module';
import { CartaoCreditoComponent } from './cartao-credito.component';
import { SelecionarDataComponent } from '../movimentacao/selecionar-data/selecionar-data.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MoedaPipe } from 'src/app/util/pipes/moeda.pipe';



@NgModule({
    imports: [
        CommonModule,
        CartaoCreditoRoutingModule,
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
        SelecionarDataComponent,
        DialogModule,
        SelectButtonModule,
        InputGroupModule,
        InputGroupAddonModule,
        CardModule ,
        ReactiveFormsModule,
        MoedaPipe
    ],
    declarations: [CartaoCreditoComponent]
})
export class CartaoCreditoModule { }


