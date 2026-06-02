import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DashboardsRoutingModule } from './painel-routing.module';
import { PainelComponent } from './painel.component';
import { MessagesModule } from 'primeng/messages';
import { MoedaPipe } from "../../../util/pipes/moeda.pipe";
import { PorcentagemPipe } from 'src/app/util/pipes/porcentagem';


import { InputTextModule } from 'primeng/inputtext';

import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';

import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    DashboardsRoutingModule,
    MessagesModule,
    MoedaPipe,
    PorcentagemPipe,
    InputTextModule,
    ButtonModule,
    RippleModule,
    SelectButtonModule,
    DialogModule,
    CalendarModule
    
],
    declarations: [PainelComponent]
})
export class PainelModule { }
