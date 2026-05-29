import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvestimentoComponent } from './investimento.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: InvestimentoComponent }
	])],
	exports: [RouterModule]
})
export class InvestimentoRoutingModule { }
