import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuariosConfigComponent} from './usuarios-config.component';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UsuariosConfigComponent }
	])],
	exports: [RouterModule]
})
export class UsuariosConfigRoutingModule { }
