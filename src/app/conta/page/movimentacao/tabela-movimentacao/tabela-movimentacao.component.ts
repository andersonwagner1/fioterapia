import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IMovimentacao } from 'src/app/conta/model/i-movimentacao';
import { IMovimentacaoFinal } from 'src/app/conta/model/i-movimentacao-final';
import { MoedaPipe } from "../../../../util/pipes/moeda.pipe";
import { ICompetencia } from 'src/app/conta/model/i-competencia';
import { BancoConta } from 'src/app/conta/model/banco-conta';
import { MovimentacaoFinalService } from 'src/app/conta/service/movimentacao-final.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MovimentacaoService } from 'src/app/conta/service/movimentacao.service';
import { DataPipe } from 'src/app/util/pipes/data.pipe';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tabela-movimentacao',
  templateUrl: './tabela-movimentacao.component.html',
  styleUrls: ['./tabela-movimentacao.component.scss'],
  standalone: true,
  imports: [TableModule, DialogModule, ButtonModule, MoedaPipe, CommonModule, RippleModule, InputNumberModule, FormsModule]
})
export class TabelaMovimentacaoComponent implements OnChanges{

  @Input() competencia : ICompetencia;
  @Input() bancoConta : BancoConta;

  @Output() evtRegistroMovimentacao = new EventEmitter<IMovimentacao>();


  vlSaldoFinal : number;
  
  listaRegistros : IMovimentacao[];
  cols: any;



  telaConfirmacaoRegistroSelecionado : boolean =false;
  telaCalcularSaldo :boolean = false;
  mostrarRegistroExcluir : boolean = false;
  registro: any;


  

  constructor(
    private movimentacaoFinalService : MovimentacaoFinalService,
    private movimentacaolService : MovimentacaoService,
    private mensagemService : MensagemAvisoService,
    private router: Router
  ) {
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

    let registro :IMovimentacao = {
      bancoConta: this.bancoConta,
      competencia: this.competencia,
      icSituacao: this.mostrarRegistroExcluir ? 'NAO' : 'SIM',
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
      repetir: 0
    }

    if(this.competencia == undefined || this.bancoConta  == undefined){
      return;
    }

   

    this.movimentacaolService.listarMovimentacaoPorCompetenciaBancoConta(registro).subscribe(
        data => this.listaRegistros = data,           
        err => console.log(err)
    );
  }


  onEditarRegistroMovimentacao(registro:any) : void{
//    this.desabilitarCampo = false;
//    this.registro.repetir = 1;
//    this.mostrarCampoRepetir = false;
  this.mensagemService.exibirMensagemSucesso("registro selecionado");
  
  this.evtRegistroMovimentacao.emit({... registro});

    
}

onConfirmarExclucaoRegistro(registro): void{
  //this.registro = registro;        
  this.telaConfirmacaoRegistroSelecionado = true;
  this.registro = registro;
  
}

onExcluirRegistro(){
  this.telaConfirmacaoRegistroSelecionado = false;
  this.registro.icSituacao = 'NAO';
  this.registro.icCalcular = 'NAO';
  
  this.movimentacaolService.salvarMovimentacao(this.registro).subscribe(
    data => this.evtRegistroMovimentacao.emit({... this.registro}),
    err => console.log(err)
  );
}

onIrPara(registro : IMovimentacao){

  this.router.navigate(["/pages/movimentacao",
    this.competencia.nrMes,
    this.competencia.nrAno,
    registro.vinculado.bancoConta.banco.id,
    registro.vinculado.bancoConta.conta.id
    ]);

}

onAtualizarCalculo(){
let movimentacaoFinal ={
  competencia : this.competencia,
  bancoConta : this.bancoConta
};

//console.log(movimentacaoFinal);
  this.movimentacaoFinalService.atualizarCalculo(movimentacaoFinal).subscribe(
      ()=>this.evtRegistroMovimentacao.emit({... this.registro}),
      err => console.log(err)
  );
}


onAbrirTelaSaldo() {
  this.telaCalcularSaldo =true
}

onGerarSaldoFinal(){
  let movimentacaoFinal : IMovimentacaoFinal= {
    vlSaldoFinal : this.vlSaldoFinal,
    competencia : this.competencia,
    bancoConta : this.bancoConta

  };


  this.telaCalcularSaldo = false;
  this.movimentacaolService.calcularSaldoFinal(movimentacaoFinal).subscribe(
      data=> 
      err=>console.log(err)
  );
}


  
}
