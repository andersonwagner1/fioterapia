import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { autenticacaoGuard } from './conta/page/pagina/login/autenticacao.guard';
import { ProntuarioListaComponent } from './conta/page/pagina/prontuario-lista/prontuario-lista.component';
import { authGuard } from './conta/guard/AuthGuard.component';




@NgModule({
    imports: [
        RouterModule.forRoot([
            { path:'login', loadChildren: () => import('./conta/page/pagina/login/login.module').then(m => m.LoginModule)}, 
            { path: '', redirectTo: 'pages/painel', pathMatch: 'full' }   ,           
            {

               
                path: '', component: AppLayoutComponent,
                children: [
                    { path: 'pages/altera-senha', loadChildren: () => import('./conta/page/acesso/alterar-senha/alterar-senha.module').then(m => m.AlterarSenhaModule), canActivate: [authGuard] } ,
                    { path: 'pages/usuario', loadChildren: () => import('./conta/page/acesso/usuario/cadastroUsuario.module').then(m => m.CadastroUsuarioModule), canActivate: [authGuard]  } ,
                    { path: 'pages/painel', loadChildren: () => import('./conta/page/pagina/painel/painel.module').then(m => m.PainelModule), canActivate: [authGuard] } ,
                    //{ path: '', loadChildren: () => import('./conta/page/pagina/painel/painel.module').then(m => m.PainelModule) },
                    { path: 'pages/lista-prontuario', loadChildren: () => import('./conta/page/pagina/prontuario-lista/prontuario-lista.module').then(m => m.ProntuarioListaModule), canActivate: [authGuard]  },
                    { path: 'pages/prontuario/:id', loadChildren: () => import('./conta/page/pagina/prontuario/prontuarioForm.module').then(m => m.ProntuarioFormModule), canActivate: [authGuard]  },
                    { path: 'pages/prontuario', loadChildren: () => import('./conta/page/pagina/prontuario/prontuarioForm.module').then(m => m.ProntuarioFormModule), canActivate: [authGuard]  },
                    { path: 'pages/agendamentos', loadChildren: () => import('./conta/page/pagina/agendamento/agendamento.module').then(m => m.AgendamentoModule) , canActivate: [authGuard] }, // <-- Nova Rota
                    { path: 'pages/usuario-config', loadChildren: () => import('./conta/page/acesso/perfil/usuarios-config.module').then(m => m.UsuariosConfigModule) , canActivate: [authGuard] },                   
                ],                 
               
            },
            
           // { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
          
          //  { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
