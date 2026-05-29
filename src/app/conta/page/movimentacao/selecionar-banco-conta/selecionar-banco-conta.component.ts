import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InputGroupModule } from 'primeng/inputgroup';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Banco } from 'src/app/conta/model/banco';
import { BancoConta } from 'src/app/conta/model/banco-conta';
import { Conta } from 'src/app/conta/model/conta';
import { ICompetencia } from 'src/app/conta/model/i-competencia';
import { BancoService } from 'src/app/conta/service/bancoService';

@Component({
  selector: 'app-selecionar-banco-conta',
  standalone: true,
  imports: [SelectButtonModule, InputGroupModule, FormsModule],
  templateUrl: './selecionar-banco-conta.component.html',
  styleUrl: './selecionar-banco-conta.component.scss'
})
export class SelecionarBancoContaComponent implements OnChanges {
  @Input() data: ICompetencia;
  @Input() bancoContaSelecionado : BancoConta={};
  @Output() evtBancoContaSelecionado = new EventEmitter<BancoConta>();

  listarBancos: Banco[] = [];
  listarContas: Conta[] = [];

  bancoSelecionado : Banco = {};
  contaSelecionado : Conta = {};


  constructor(
    private bancoService : BancoService    
  ) {
   
   
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes['data'] && changes['data'].currentValue) {
      this.executarAcaoDataSelecionado();
    }

    //CASO ESTEJA ABRINDO ALGUMA JANELA ATRAVES DA URL
    if (changes['bancoContaSelecionado'] && changes['bancoContaSelecionado'].currentValue) {      
      //SERÁ NECESSARIO REALIZAR A ALTERAÇÃO
      this.bancoSelecionado = this.bancoContaSelecionado.banco;
      this.contaSelecionado = this.bancoContaSelecionado.conta;
    }
  }

  executarAcaoDataSelecionado() {

    this.bancoService.listarBancosPorCompetencia(this.data).subscribe(
      data => {
          this.listarBancos = data;
          this.onSelecionadoBanco();
      },
      err => console.log(err)
  );
   
  }


  onSelecionadoBanco() : void{

    if(this.bancoSelecionado == undefined || this.bancoSelecionado.id ==  null){
      return; 
    }


  this.bancoService.listarContaPorBanco(this.bancoSelecionado, this.data).subscribe(
    data => {
        this.listarContas = data;
        this.onSelecionadoConta();
    },
    err => console.log(err)
)



}

onSelecionadoConta() : void{

  if(this.contaSelecionado.id == null){
    return;
  }

  this.bancoContaSelecionado = {
    banco :  this.bancoSelecionado,
    conta : this.contaSelecionado
  }
  

  this.bancoService.consultarBancoContaPorIdBancoConta(this.bancoContaSelecionado).subscribe(
    data => {
      if(data.data != null ){
        this.evtBancoContaSelecionado.emit({... data.data});
      }
      
    },err => console.log(err)
  )
  
}











}
