import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { BancoService } from './conta/service/bancoService';
import { MovimentacaoService } from './conta/service/movimentacao.service';
import { ContaService } from './conta/service/conta.service';
import { BancoContaService } from './conta/service/banco-conta.service';

@NgModule({
    declarations: [AppComponent],
    imports: [AppRoutingModule, AppLayoutModule],
    providers: [
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        BancoService, MovimentacaoService, ContaService, BancoContaService

    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
