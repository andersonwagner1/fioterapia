import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProntuarioListaComponent } from './prontuario-lista.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProntuarioListaComponent }
	])],
	exports: [RouterModule]
})
export class ProntuarioListaRoutingModule { }
