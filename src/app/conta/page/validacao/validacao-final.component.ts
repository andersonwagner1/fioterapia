import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';
import { ContaService } from '../../service/conta.service';
import { IMovimentacaoFinal } from '../../model/i-movimentacao-final';
import { MovimentacaoFinalService } from '../../service/movimentacao-final.service';
import { BancoConta } from '../../model/banco-conta';
import { BancoContaService } from '../../service/banco-conta.service';
import { MoedaPipe } from 'src/app/util/pipes/moeda.pipe';


@Component({
  selector: 'app-validacao',
  templateUrl: './validacao-final.component.html',
  styleUrl: './validacao-final.component.scss',
  
  providers: [MessageService, MensagemAvisoService]
})
export class ValidacaoFinalComponent extends UtilBasicoModule<IMovimentacaoFinal> implements OnInit {


    listaBancoConta : BancoConta[] = [];
    bancoContaSelecinado : BancoConta;

    //titulo da pagina
    titulo = "Conta final";
    situacao = this.getSituacaoOpcoes();


    /**
     * Construtor
     * @param ContaService
     * @param mensagemAviso
     */
    constructor( contaService : MovimentacaoFinalService, private bancoContaService : BancoContaService,  mensagemAviso : MensagemAvisoService) {
        super(contaService, mensagemAviso);

    }

    onBuscarDados() : void{
        this.registro = this.bancoContaSelecinado;
        this.carregarLista();
    }

    onAtualizar(registro : IMovimentacaoFinal): void{
        this.onSalvarAtualizarRegistro(registro);
    }

    getLabelByValue(value: string): string {
        const selectedOption = this.situacao.find(option => option.value === value);
        return selectedOption ? selectedOption.label : 'SIM';
    }


    ngOnInit() {
        this.bancoContaService.listaBancosAtivo().subscribe(
            dada => {
                this.listaBancoConta = dada;
                this.listaBancoConta = this.listaBancoConta.map(bancoConta => {
                    return {
                      ...bancoConta,
                      label: `${bancoConta.id} - ${bancoConta.banco?.dsBanco} - ${bancoConta.conta?.dsConta}`
                    };
                  });
  
            },
            err => this.mensagemAviso.exibirMensagemErro(err)
        );
              
    }

   
}
