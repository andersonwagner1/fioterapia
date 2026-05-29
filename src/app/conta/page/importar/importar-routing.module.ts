import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportarComponent } from './importar.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: ImportarComponent }
	])],
	exports: [RouterModule]
})
export class ImportarRoutingModule { }
