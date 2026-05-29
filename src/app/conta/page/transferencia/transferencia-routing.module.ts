import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransferenciaComponent } from './transferencia.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: TransferenciaComponent }
	])],
	exports: [RouterModule]
})
export class TransferenciaRoutingModule { }
