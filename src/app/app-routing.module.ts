import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { InvestimentoComponent } from './conta/page/investimento/investimento.component';

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
                    
                    { path: 'pages/conta', loadChildren: () => import('./conta/page/conta/conta.module').then(m => m.ContaModule) },
                    { path: 'pages/movimentacao', loadChildren: () => import('./conta/page/movimentacao/movimentacao.module').then(m => m.MovimentacaoModule) },
                    { path: 'pages/movimentacao/:mes/:ano/:banco/:conta', loadChildren: () => import('./conta/page/movimentacao/movimentacao.module').then(m => m.MovimentacaoModule) },
                    { path: 'pages/cartao-credito/:mes/:ano/:banco/:cont', loadChildren: () => import('./conta/page/cartaoCredito/cartao-credito.module').then(m => m.CartaoCreditoModule) },
                    { path: 'pages/cartao-credito', loadChildren: () => import('./conta/page/cartaoCredito/cartao-credito.module').then(m => m.CartaoCreditoModule) },
                    { path: 'migrar/movimentacao/:id', loadChildren: () => import('./conta/page/movimentacao/movimentacao.module').then(m => m.MovimentacaoModule) },
                    { path: 'pages/categoria', loadChildren: () => import('./conta/page/categoria/categoria.module').then(m=> m.CategoriaModule)},
                    { path: 'pages/tipo-movimentacao', loadChildren: () => import('./conta/page/tipoMovimentacao/tipo-movimentacao.module').then(m=> m.TipoMovimentacaoModule)},
                    { path: 'pages/transferencia', loadChildren: () => import('./conta/page/transferencia/transferencia.module').then(m=> m.TransferenciaModule)},
                    { path: 'pages/investimento', loadChildren: () => import('./conta/page/investimento/investimento.module').then(m=> m.InvestimentoModule)},
                    { path: 'pages/alteracaoRegistro', loadChildren: () => import('./conta/page/alteracaoRegistro/alteracao-registro.module').then(m=> m.AlteracaoRegistroModule)},
                    { path: 'pages/validacaoFinal', loadChildren: () => import('./conta/page/validacao/validacao-final.module').then(m=> m.ValidacaoFinalModule)},
                    { path: 'pages/importar', loadChildren: () => import('./conta/page/importar/importar.module').then(m=> m.ImportarModule)},
                    
                 
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
