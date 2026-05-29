import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';
import { IMovimentacao } from '../../model/i-movimentacao';
import { BancoConta } from '../../model/banco-conta';
import { ITipoMovimentacao } from '../../model/i-tipo-movimentacao';
import { ICompetencia } from '../../model/i-competencia';
import { ActivatedRoute } from '@angular/router';
import { MovimentacaoService } from '../../service/movimentacao.service';
import { TabelaMovimentacaoComponent } from './tabela-movimentacao/tabela-movimentacao.component';
import { TipoMovimentacaoService } from '../../service/tipo-movimentacao.service';
import { RegistrarComponent } from './registrar/registrar.component';




@Component({
  selector: 'app-movimentacao',
  templateUrl: './movimentacao.component.html',
  styleUrl: './movimentacao.component.scss',
  providers: [MessageService, MensagemAvisoService]
})
export class MovimentacaoComponent extends UtilBasicoModule<IMovimentacao> implements OnInit {

  @ViewChild(TabelaMovimentacaoComponent) tabelaComponent!: TabelaMovimentacaoComponent;
  

    provisorio : number;
    aviso : string ="tsets";

    constructor(private route: ActivatedRoute,
        private movimentacaoService: MovimentacaoService,
        
        private _activatedRoute : ActivatedRoute,
        mensagemAviso : MensagemAvisoService) {
        super(movimentacaoService, mensagemAviso);
    }

    ngOnInit() {

      let competencia = {
        nrAno : new Date().getFullYear(),
        nrMes : new Date().getMonth() + 1
      }
      this.registro.competencia = competencia;

      this._activatedRoute.params.subscribe(params => {  
        
        if(params['ano'] == undefined){
          return ;
        }
        
        let competencia = {
          nrAno :  params['ano'],
          nrMes : params['mes']
        };

        let bancoConta = {
          banco : {
            id : params['banco']
          },
          conta : {
            id : params['conta']
          }
        } 


       
        this.registro.competencia = competencia;
        this.registro.bancoConta = bancoConta;
        
      });


      
      
      


    
      /*this.route.paramMap.subscribe(params =>{
        let idBanco = +params.get('id'); 
        this.provisorio = idBanco;
        this.provisorios(idBanco);
       });*/
    }

  
    evReceberData(data : ICompetencia){     
      this.registro.competencia = data;
    }

    evReceberBancoConta(bancoContaSelecionado : BancoConta){      
      this.registro.bancoConta = bancoContaSelecionado;
    }

    evRegistroMovimento(movimentacao :IMovimentacao){
      this.service.getPorId(movimentacao.id).subscribe(
        dado => this.registro = dado,
        err => this.mensagemAviso.exibirMensagemErro(err)
    );
    

    }

   

    evAtualizarMovimentacao(atualizarTeste : Boolean){
      this.tabelaComponent.atualizarMovimentacaoFinal();
    }
    
/*
    provisorios(id : number): void {
      this.movimentacaoService.migrar(id).subscribe(
          data =>{
              this.registro.dsObservacao = data.dsObservacao;
              this.registro.nrDia = data.nrDia;

              let tipoMovimentacao : ITipoMovimentacao ={
                  dsTipoMovimentacao: data.dsTipoMovimentacao,
                  id : data.idTipoMovimentacao,
                  dsObservacao: '',
                  categoria: undefined
              }
              

              this.registro.tipoMovimentacao = tipoMovimentacao;


              this.tipoMovimentacaoService.getPorId(tipoMovimentacao.id).subscribe(
                data =>{

                 this.registro.tipoMovimentacao = data
                // this.registraComponent.onItemTipoMovimentacaoSelecionado();
                },
                err => console.log(err)
              )

              

              this.registro.icCalcular = 'SIM';
              this.registro.vlCredito = data.credito;
              this.registro.vlDebito = data.debito;



              this.registro.bancoConta = {
                banco : {
                  id : data.bancoId
                },
                conta : {
                  id : data.contaId
                }
              }

              this.provisorio = id;

              let dataSelecionada = {
                nrAno : data.nrAno,
                nrMes : data.nrMes
              }

              this.registro.competencia = dataSelecionada;
          }

      )
  }*/
}


