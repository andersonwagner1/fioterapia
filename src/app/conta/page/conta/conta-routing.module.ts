import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContaComponent } from './conta.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ContaComponent }
	])],
	exports: [RouterModule]
})
export class ContaRoutingModule { }
