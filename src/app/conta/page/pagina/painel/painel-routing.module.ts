import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PainelComponent } from './painel.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PainelComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
