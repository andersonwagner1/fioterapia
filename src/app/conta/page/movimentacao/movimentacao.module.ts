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
import { MovimentacaoComponent } from './movimentacao.component';
import { MovimentacaoRoutingModule } from './movimentacao-routing.module';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputMaskModule } from 'primeng/inputmask';
import { MoedaPipe } from 'src/app/util/pipes/moeda.pipe';
import { DataPipe } from 'src/app/util/pipes/data.pipe';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { SaldoComponent } from "./saldo/saldo.component";

import { InputSwitchModule } from 'primeng/inputswitch';
import { SelecionarDataComponent } from './selecionar-data/selecionar-data.component';
import { SelecionarBancoContaComponent } from './selecionar-banco-conta/selecionar-banco-conta.component';
import { TabelaMovimentacaoComponent } from './tabela-movimentacao/tabela-movimentacao.component';
import { RegistrarComponent } from "./registrar/registrar.component";






@NgModule({
    imports: [
    CommonModule,
    AutoCompleteModule,
    InputGroupAddonModule,
    InputGroupModule,
    SelectButtonModule,
    MovimentacaoRoutingModule,
    TableModule,
    FileUploadModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputSwitchModule,
    RatingModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    InputMaskModule,
    MoedaPipe,
    DataPipe,
    PanelModule,
    CheckboxModule,
    SaldoComponent,
    InputSwitchModule,
    SelecionarDataComponent,
    SelecionarBancoContaComponent,
    TabelaMovimentacaoComponent,
    RegistrarComponent,
    
],
/*
exports: [
    MovimentacaoComponent,
    
],*/


    declarations: [MovimentacaoComponent, MovimentacaoComponent  ]
})
export class MovimentacaoModule { }


