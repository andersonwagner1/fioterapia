import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlteracaoRegistroComponent } from './alteracao-registro.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AlteracaoRegistroComponent }
	])],
	exports: [RouterModule]
})
export class AlteracaoRegistroRoutingModule { }
