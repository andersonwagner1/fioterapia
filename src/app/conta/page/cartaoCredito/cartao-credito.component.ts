import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { Router } from '@angular/router';
import { ICategoriaMovimentacao } from '../../model/i-categoria-movimentacao';

import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';
import { ICompetencia } from '../../model/i-competencia';
import { CartaoCreditoService } from '../../service/cartao-credito.service';
import { BancoConta } from '../../model/banco-conta';

import { ICartoaCredito } from '../../model/i-cartao-credito';
import { TipoMovimentacaoService } from '../../service/tipo-movimentacao.service';
import { ITipoMovimentacao } from '../../model/i-tipo-movimentacao';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-cartao-credito',
  templateUrl: './cartao-credito.component.html',
  styleUrls: ['./cartao-credito.component.scss'], // Corrigido de 'styleUrl' para 'styleUrls'
  providers: [MessageService, MensagemAvisoService]
})
export class CartaoCreditoComponent extends UtilBasicoModule<ICartoaCredito> implements OnInit {
    protected cols: any[] = [];
    protected situacao: { label: string; value: string; }[] = [];
    

    dataSelecionada :ICompetencia;

    listaTipoMovimentacao : ITipoMovimentacao[] = [];
    

    listaBancos : BancoConta[] =[];
    

    formulario: FormGroup;

    somarTotal : number;


   

    constructor(
        private router: Router,
        private cartaoCreditoService: CartaoCreditoService,
        private tipoMovimentacaoService: TipoMovimentacaoService,
        private fb: FormBuilder,
        mensagemAviso: MensagemAvisoService
    ) {
        super(cartaoCreditoService, mensagemAviso);

        this.formulario = this.fb.group({
            id: [null],
            nrDia: ['', [Validators.required, Validators.minLength(3)]],
            vlCompra: ['', [Validators.required, Validators.minLength(3)]],
            dsObservacao: ['', [Validators.required, Validators.minLength(3)]],
            nrParcelas: ['', [Validators.required, Validators.minLength(3)]],                        
            bancoConta:  this.fb.group({
                id: [null],               
              }),           
            
              tipoMovimentacao: this.fb.group({
                id: [null],               
              }),            
          });
    }

    evReceberData(data : ICompetencia){  
        this.dataSelecionada = data;
        this.cartaoCreditoService.listarBancoQuePossuimCartaoCreditoPorCompetencia(data.id).subscribe(
            data => this.listaBancos = data,
            err => this.mensagemAviso.exibirMensagemErro(err)
        );
        this.onSelecionarCartaoCredito();
    }

    ngOnInit(): void {
       let  dataSelecionada : ICompetencia = {
            nrAno : new Date().getFullYear(),
            nrMes : new Date().getMonth() + 1

        }

        this.tipoMovimentacaoService.listarDebitosAtivos().subscribe(
            data => this.listaTipoMovimentacao = data,
            err => this.mensagemAviso.exibirMensagemErro(err)
        )
        this.dataSelecionada = dataSelecionada;
       
    }

    onNovo(){
        
        const bancoConta = this.formulario.get('bancoConta')?.value; // Obtém o valor de nrDia
        this.formulario.reset({
            bancoConta : bancoConta,
            nrParcelas : 1
        });
        
        

    }

    onEditarRegistroMovimentacao(registro:any){
        this.cartaoCreditoService.getPorId(registro.id).subscribe(
            data =>{
                this.registro = data;
                registro.nrParcelas =1;
                this.formulario.patchValue(registro);
            } ,
                
            err => this.mensagemAviso.exibirMensagemErro(err)
        );
    }

    onConfirmarExclucaoRegistro(registro:any){
        this.cartaoCreditoService.excluir(registro).subscribe(
            data=> this.mensagemAviso.exibirMensagemSucesso("Excluido com sucesso"),
            err => this.mensagemAviso.exibirMensagemErro(err)
        )
    }

    onSalvar(){
        this.registro = this.formulario.value;
        this.registro.competencia = this.dataSelecionada;
        if(!this.formulario.valid){
            this.mensagemAviso.exibirMensagemSucesso("erro");
        }

        this.cartaoCreditoService.salvar(this.registro).subscribe(
            () => {
                this.mensagemAviso.exibirMensagemSucesso("Registro salvo com sucesso");
                
                this.onNovo();
                this.onSelecionarCartaoCredito();
            },
            err => this.mensagemAviso.exibirMensagemErro(err)
        )
    }

    onSelecionarCartaoCredito(){
        let bancoSelecionado = this.formulario.value.bancoConta;

        if(bancoSelecionado.id == null){
            return;
        }

          this.cartaoCreditoService.listarMovimentacaoPorBancoCompetncia(this.dataSelecionada.id, bancoSelecionado.id).subscribe(
            data =>{
                
                this.listaRegistros = data ;
                this.somarCompras(this.listaRegistros);
            } ,
            err => this.mensagemAviso.exibirMensagemErro(err)
        );
    }

    somarCompras(listaRegistros : ICartoaCredito []) : void{
        this.somarTotal = listaRegistros.reduce((acc, valor) => acc + valor.vlCompra, 0);
    }

    getLabelByValue(value: string): string {
        const selectedOption = this.situacao.find(option => option.value === value);
        return selectedOption ? selectedOption.label : 'SIM';
    }

    onAbrirCategoriaConta(registro: ICategoriaMovimentacao): void {
        console.log(registro);
        this.router.navigate(['/pages/categoria-conta', registro.id]); 
    }
}
