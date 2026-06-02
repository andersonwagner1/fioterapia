import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";



@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./conta/page/painel/painel.module').then(m => m.PainelModule) },
                    { path: 'pages/lista-prontuario', loadChildren: () => import('./conta/page/prontuario-lista/prontuario-lista.module').then(m => m.ProntuarioListaModule) },
                    { path: 'pages/prontuario/:id', loadChildren: () => import('./conta/page/prontuario/prontuarioForm.module').then(m => m.ProntuarioFormModule) },
                    { path: 'pages/prontuario', loadChildren: () => import('./conta/page/prontuario/prontuarioForm.module').then(m => m.ProntuarioFormModule) },
                    { path: 'pages/agendamentos', loadChildren: () => import('./conta/page/agendamento/agendamento.module').then(m => m.AgendamentoModule) } // <-- Nova Rota
                    
                   
                 
                ]
            },
           // { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
          //  { path: 'notfound', component: NotfoundComponent },
          //  { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
