import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [RouterModule.forChild([
       // {path: 'bancos', loadChildren: () => import('./banco/banco.module').then(m=> m.BancoModule)},
      //  {path: 'movimentacao', loadChildren: () => import('./movimentacao/movimentacao.module').then(m=> m.MovimentacaoModule)},
      //  {path: 'movimentacao/:mes/:ano/:banco/:conta', loadChildren: () => import('./movimentacao/movimentacao.module').then(m=> m.MovimentacaoModule)},
      //  {path: 'conta', loadChildren: () => import('./conta/conta.module').then(m=> m.ContaModule)},
      //  {path: 'banco', loadChildren: () => import('./banco/banco.module').then(m=> m.BancoModule)},
      //  {path: 'banco-conta/:id', loadChildren: () => import('./bancoConta/banco-conta.module').then(m=> m.BancoContaModule)},
      //  {path: 'competencia', loadChildren: () => import('./competencia/competencia.module').then(m=> m.CompetenciaModule)},
      //  {path: 'categoria', loadChildren: () => import('./categoria/categoria.module').then(m=> m.CategoriaModule)},
      //  {path: 'tipo-movimentacao', loadChildren: () => import('./tipoMovimentacao/tipo-movimentacao.module').then(m=> m.TipoMovimentacaoModule)},
      //  {path: 'transferencia', loadChildren: () => import('./transferencia/transferencia.module').then(m=> m.TransferenciaModule)}


        //  { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
