import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartaoCreditoComponent } from './cartao-credito.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CartaoCreditoComponent }
	])],
	exports: [RouterModule]
})
export class CartaoCreditoRoutingModule { }
