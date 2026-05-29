import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategoriaMovimentacao } from '../../model/i-categoria-movimentacao';

import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';
import { CategoriaService } from '../../service/categoria.service.';
import { IMovimentacao } from '../../model/i-movimentacao';
import { MovimentacaoService } from '../../service/movimentacao.service';
import { BancoConta } from '../../model/banco-conta';
import { ICompetencia } from '../../model/i-competencia';
import { CompetenciaService } from '../../service/competencia.service';
import { BancoContaService } from '../../service/banco-conta.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './alteracao-registro.component.html',
  styleUrls: ['./alteracao-registro.scss'], // Corrigido de 'styleUrl' para 'styleUrls'
  providers: [MessageService, MensagemAvisoService]
})
export class AlteracaoRegistroComponent extends UtilBasicoModule<IMovimentacao> implements OnInit {
    protected cols: any[] = [];
    protected situacao: { label: string; value: string; }[] = [];
    protected tipos: { label: string; value: string; }[] = [];

    listarCompetencia : ICompetencia[];
    listarBancoConta : BancoConta[]

    titulo = "Categorias Cadastradas";

    constructor(
        private router: Router,
        private movimentacaoService: MovimentacaoService,
        private competenciaSErvice: CompetenciaService,
        private bancoContaService: BancoContaService,
        mensagemAviso: MensagemAvisoService
    ) {
        super(movimentacaoService, mensagemAviso);
    }

    ngOnInit(): void {
        this.registro={
            id: 0,
            competencia: {
                id:0
            },
            bancoConta: {
                id:0
            },
            tipoMovimentacao: undefined,
            vinculado: undefined,
           investimento: undefined,

            nrPosicao: 0,
            dtMovimentacao: undefined,
            nrDia: 0,
            vlCredito: 0,
            vlDebito: 0,
            vlSaldo: 0,
            dsObservacao: '',
            icCalcular: '',
            icSituacao: '',
            repetir: 1
        }

       

        this.bancoContaService.listarTodos().subscribe(
            data => {this.listarBancoConta = data;
                },
            err => this.mensagemAviso.exibirMensagemErro(err)
        );

        this.competenciaSErvice.listarTodos().subscribe(
            data => {this.listarCompetencia = data;
            },
            err => this.mensagemAviso.exibirMensagemErro(err)
        );


       
        this.onMonstarInformacao();
    }


    onMonstarInformacao(){
        
/*
        this.movimentacaoService.listarMovimentacaoPorCompetenciaBancoConta(this.registro).subscribe(
            data => {this.listaRegistros = data;
                console.log("testes", this.listaRegistros)},
            err => this.mensagemAviso.exibirMensagemErro(err)
        );
        */
    }

    

  
}
