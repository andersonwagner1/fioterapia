import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProntuarioFormComponent } from './prontuarioForm.component';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ProntuarioFormComponent }
	])],
	exports: [RouterModule]
})
export class ProntuarioFormRoutingModule { }
