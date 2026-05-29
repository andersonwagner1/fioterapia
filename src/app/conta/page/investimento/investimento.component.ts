import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITipoMovimentacao } from '../../model/i-tipo-movimentacao';
import { ICategoriaMovimentacao } from '../../model/i-categoria-movimentacao';
import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';

import { TipoMovimentacaoService } from '../../service/tipo-movimentacao.service';
import { CategoriaService } from '../../service/categoria.service.';
import { IInvestimento } from '../../model/i-investimento';
import { InvestimentoService } from '../../service/investimento.service';
import { MovimentacaoService } from '../../service/movimentacao.service';

@Component({
  selector: 'app-investimento',
  templateUrl: './investimento.component.html',
  styleUrls: ['./investimento.component.scss'],
  providers: [MessageService, MensagemAvisoService]
})
export class InvestimentoComponent extends UtilBasicoModule<IInvestimento> implements OnInit {
  protected cols: any[] = [];
  protected situacao: { label: string; value: string; }[] = [];
 

  listarBancosInvestimentoAtivos: { id: number, contaBanco: string }[] = [];

  // Título da página
  titulo = "Investimentos cadastrados";


  /**
   * Construtor
   * @param investimentoService
   * @param mensagemAviso
   */
  constructor(
    private tipoMovimentacaoService : TipoMovimentacaoService,
    private investimentoService: InvestimentoService,
    mensagemAviso: MensagemAvisoService
  ) {
    super(investimentoService, mensagemAviso);
  }

  ngOnInit(): void {
    // Inicializa a situação e carrega os dados
    this.situacao = this.getSituacaoOpcoes();
    this.carregarLista();
    this.carregarBancosInvestimentoAtivos();

    this.registro  = {
      bancoConta : {
        id : 0
      },
      dsInvestimento : null
    }
  }





  /**
   * Carrega a lista de bancos ativos para investimentos
   */
  private carregarBancosInvestimentoAtivos(): void {
    
    this.investimentoService.listarTodosBancoInvestimentoAtivo().subscribe(
      (data: any[]) => {
        
        this.listarBancosInvestimentoAtivos = data.map(item => ({
          id: item.id,
          contaBanco: `${item.conta.dsConta} (${item.banco.dsBanco})`
        }));
      },
      (err: any) => this.mensagemAviso.exibirMensagemErro(err)
    );
  }

  /**
   * Retorna o label da situação com base no valor selecionado
   * @param value
   * @returns string
   */
  getLabelByValue(value: string): string {
    const selectedOption = this.situacao.find(option => option.value === value);
    return selectedOption ? selectedOption.label : 'SIM';
  }

 
 
}