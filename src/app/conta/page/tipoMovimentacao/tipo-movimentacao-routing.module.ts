import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TipoMovimentacaoComponent } from './tipo-movimentacao.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TipoMovimentacaoComponent }
	])],
	exports: [RouterModule]
})
export class TipoMovimentacaoRoutingModule { }
