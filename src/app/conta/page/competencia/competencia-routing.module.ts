import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompetenciaComponent } from './competencia.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CompetenciaComponent }
	])],
	exports: [RouterModule]
})
export class CompetenciaRoutingModule { }
