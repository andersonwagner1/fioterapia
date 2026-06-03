import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgendamentoComponent} from './agendamento.component';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AgendamentoComponent }
	])],
	exports: [RouterModule]
})
export class AgendamentoRoutingModule { }
