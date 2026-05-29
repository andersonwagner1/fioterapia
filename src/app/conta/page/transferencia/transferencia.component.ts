import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';

import { ActivatedRoute, Router } from '@angular/router';
import { ITransferencia } from '../../model/i-transferencia';
import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';
import { BancoConta } from '../../model/banco-conta';
import { BancoContaService } from '../../service/banco-conta.service';
import { TransferenciaService } from '../../service/transferencia.service';



@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.component.html',
  styleUrl: './transferencia.component.scss',
  providers: [MessageService, MensagemAvisoService]
})
export class TransferenciaComponent extends UtilBasicoModule<ITransferencia> implements OnInit {

    protected cols: any[] = [];
    protected situacao: { label: string; value: string; }[];

    //titulo da pagina
    titulo = "Transferencia cadastrados";

    listaBancosDisponiveis : BancoConta[] = [];
    listaBancos : BancoConta[] = [];
    bancoSelecioado : BancoConta;


    /**
     * Construtor
     * @param transferenciaService
     * @param mensagemAviso
     */
    constructor(private router : Router, private bancoContaService : BancoContaService, private transferenciaService : TransferenciaService,  mensagemAviso : MensagemAvisoService) {
        super(transferenciaService, mensagemAviso);

    }


    ngOnInit() {

        this.registro ={

            bancoConta :{
                id:0
            },
            transferirPara:{
                id:0
            }
        }

        this.bancoContaService.listaBancosAtivo().subscribe(
            dada => {
                this.listaBancos = dada;
                this.listaBancos = this.listaBancos.map(bancoConta => {
                    return {
                      ...bancoConta,
                      label: `${bancoConta.banco?.dsBanco} - ${bancoConta.conta?.dsConta}`
                    };
                  });
                console.log(this.listaBancos);
            },
            err => this.mensagemAviso.exibirMensagemErro(err)
        );
        //colocar dentro de um extende para caso necessario realizar a carga em um emtodos
        this.situacao = this.getSituacaoOpcoes();
        this.carregarLista();
    }

    onEditarTransferencia(registro : ITransferencia){
        this.transferenciaService.consultarTransferencia(registro).subscribe(
            data =>{
                this.registro =data;
                this.telaRegistro = true;
                this.onSelecionarBancoConta();
            },
            err => this.mensagemAviso.exibirMensagemErro(err)
        )
    }


    onSelecionarBancoConta(){
        this.bancoContaService.listarBancosDisponives(this.registro.bancoConta).subscribe(
            dada =>{
                this.listaBancosDisponiveis = dada;
                this.listaBancosDisponiveis = this.listaBancosDisponiveis.map(
                    d => {
                        return {...d, label: `${d.banco.dsBanco} - ${d.conta.dsConta}`}
                    }
                );
            },

            err => this.mensagemAviso.exibirMensagemErro(err)
        )
    }


    onAbrirTransferenciaConta(registro : ITransferencia){
        this.router.navigate(['/pages/transferencia-conta', registro.id]);  // Navega para 'transferencia-contas' com o parâmetro 'id'

    }



}
