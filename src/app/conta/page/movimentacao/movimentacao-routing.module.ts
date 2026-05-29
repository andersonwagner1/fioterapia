import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MovimentacaoComponent } from './movimentacao.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MovimentacaoComponent }
	])],
	exports: [RouterModule]
})
export class MovimentacaoRoutingModule{ }
