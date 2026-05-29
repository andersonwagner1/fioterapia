import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ValidacaoFinalComponent } from './validacao-final.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ValidacaoFinalComponent }
	])],
	exports: [RouterModule]
})
export class ValidacaoFinalRoutingModule { }
