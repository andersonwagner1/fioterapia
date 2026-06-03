import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { autenticacaoGuard } from './conta/page/pagina/login/autenticacao.guard';
import { ProntuarioListaComponent } from './conta/page/pagina/prontuario-lista/prontuario-lista.component';




@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: 'pages/altera-senha', loadChildren: () => import('./conta/page/acesso/alterar-senha/alterar-senha.module').then(m => m.AlterarSenhaModule) } ,
                    { path: 'pages/usuario', loadChildren: () => import('./conta/page/acesso/usuario/cadastroUsuario.module').then(m => m.CadastroUsuarioModule) } ,
                    { path: 'pages/painel', loadChildren: () => import('./conta/page/pagina/painel/painel.module').then(m => m.PainelModule), canActivate: [autenticacaoGuard] } ,
                    { path: '', loadChildren: () => import('./conta/page/pagina/painel/painel.module').then(m => m.PainelModule) },
                    { path: 'pages/lista-prontuario', loadChildren: () => import('./conta/page/pagina/prontuario-lista/prontuario-lista.module').then(m => m.ProntuarioListaModule) },
                    { path: 'pages/prontuario/:id', loadChildren: () => import('./conta/page/pagina/prontuario/prontuarioForm.module').then(m => m.ProntuarioFormModule) },
                    { path: 'pages/prontuario', loadChildren: () => import('./conta/page/pagina/prontuario/prontuarioForm.module').then(m => m.ProntuarioFormModule) },
                    { path: 'pages/agendamentos', loadChildren: () => import('./conta/page/pagina/agendamento/agendamento.module').then(m => m.AgendamentoModule) }, // <-- Nova Rota
                    { path: 'pages/usuario-config', loadChildren: () => import('./conta/page/acesso/perfil/usuarios-config.module').then(m => m.UsuariosConfigModule) },
                    { 
                        path: 'pages/prontuario2', 
                        component: ProntuarioListaComponent, 
                        canActivate: [autenticacaoGuard],
                        data: { perfilEsperado: 'FISIOTERAPEUTA' 
                    } 
}                   
                ],
                //  { path: 'notfound', component: NotfoundComponent },
               
            },
            { path:'login', loadChildren: () => import('./conta/page/pagina/login/login.module').then(m => m.LoginModule)}
           // { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
          
          //  { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
