import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IMovimentacao } from 'src/app/conta/model/i-movimentacao';
import { IMovimentacaoFinal } from 'src/app/conta/model/i-movimentacao-final';
import { MoedaPipe } from "../../../../util/pipes/moeda.pipe";
import { ICompetencia } from 'src/app/conta/model/i-competencia';
import { BancoConta } from 'src/app/conta/model/banco-conta';
import { MovimentacaoFinalService } from 'src/app/conta/service/movimentacao-final.service';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { CompetenciaService } from 'src/app/conta/service/competencia.service';




@Component({
  selector: 'app-saldo',
  templateUrl: './saldo.component.html',
  styleUrls: ['./saldo.component.scss'],
  standalone: true,
  imports: [MoedaPipe, MessagesModule, ButtonModule]
})
export class SaldoComponent implements OnChanges, OnInit{

  @Input() competencia : ICompetencia;
  @Input() bancoConta : BancoConta;
  

   movimentacaoRegistro : any[];
  movimentacaoFinal : IMovimentacaoFinal;

  @Output() evtDataSelecionada = new EventEmitter<ICompetencia>();

  aviso : any = [];
  


  constructor(private movimentacaoFinalService : MovimentacaoFinalService,
    private competenciaService : CompetenciaService,
    private mensagemAviso: MensagemAvisoService
  ) {
   
  }
  ngOnInit(): void {
   
  }

  onAvancar(pos){
    this.competencia.id = this.competencia.id  + pos;
    
    this.competenciaService.getPorId(this.competencia.id).subscribe(
      dada =>  this.evtDataSelecionada.emit({ ...dada}),
      err => this.mensagemAviso.exibirMensagemErro(err)
    )    
  }

  onFecharMes(){
    if(this.movimentacaoFinal == undefined){
      this.movimentacaoFinal ={
        icFechado : "SIM",
        competencia : this.competencia,
        bancoConta : this.bancoConta
      }
    }

    this.movimentacaoFinal.icFechado = "SIM";
    this.movimentacaoFinalService.salvar(this.movimentacaoFinal).subscribe(
      () => this.adicionarMensagem("success", "Mes fechado"),
      err => this.adicionarMensagem("err", err)
    )
  }


  adicionarMensagem(info : string, mensagem : string) {

    this.aviso = [
        { severity: info, summary: mensagem}
         
    ];
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['competencia'] && changes['competencia'].currentValue) {
      this.atualizarMovimentacaoFinal();
    }

    if (changes['bancoConta'] && changes['bancoConta'].currentValue) {
      this.atualizarMovimentacaoFinal();
    }

  }


  
  atualizarMovimentacaoFinal() : void{
    if(this.competencia == undefined || this.bancoConta == undefined){
      return;
    }
    this.movimentacaoFinalService.mostrarSaldoFinalPorCompetenciaBanco(this.competencia, this.bancoConta).subscribe(
      data=> {      
        this.movimentacaoFinal = data;
        this.aviso = [];
       


        if(this.movimentacaoFinal.icFechado === 'SIM'){
          this.adicionarMensagem("success", "Mes fechado");
          return;
        }

        if(this.movimentacaoFinal.icFechado == 'NAO'){
          this.adicionarMensagem("warn", "Mes ainda não finalizado")

        }
      
        if(this.movimentacaoFinal.vlTotalCredito != this.movimentacaoFinal.vlEsperadoCredito && this.movimentacaoFinal.vlEsperadoCredito != null){
          
          this.adicionarMensagem("error", "Valor Credito não esta batendo  Valor Atual: " + this.movimentacaoFinal.vlTotalCredito +" Valor Esperado: " + this.movimentacaoFinal.vlEsperadoCredito )
        }

        if(this.movimentacaoFinal.vlTotalDebito != this.movimentacaoFinal.vlEsperadoDebito && this.movimentacaoFinal.vlEsperadoDebito != null){
          this.adicionarMensagem("error", "Valor Debito não esta batendo  Valor Atual: " + this.movimentacaoFinal.vlTotalDebito +" Valor Esperado: " + this.movimentacaoFinal.vlEsperadoDebito )
        }

        if(this.movimentacaoFinal.vlSaldoFinal != this.movimentacaoFinal.vlEsperado){
          this.adicionarMensagem("error", "Valor final não esta batendo Valor Atual: " + this.movimentacaoFinal.vlSaldoFinal +" Valor Esperado: " + this.movimentacaoFinal.vlEsperado )
        }

      },
      err => console.log(err)
  )
  }




  
}
