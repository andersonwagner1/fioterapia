import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlterarSenhaComponent } from './alterar-senha.component';




@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: AlterarSenhaComponent }
	])],
	exports: [RouterModule]
})
export class AlterarSenhaRoutingModule { }
