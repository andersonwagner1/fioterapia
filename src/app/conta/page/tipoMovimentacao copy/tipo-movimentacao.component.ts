import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITipoMovimentacao } from '../../model/i-tipo-movimentacao';
import { ICategoriaMovimentacao } from '../../model/i-categoria-movimentacao';
import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';

import { TipoMovimentacaoService } from '../../service/tipo-movimentacao.service';
import { CategoriaService } from '../../service/categoria.service.';

@Component({
  selector: 'app-tipo-movimentacao',
  templateUrl: './tipo-movimentacao.component.html',
  styleUrls: ['./tipo-movimentacao.component.scss'],
  providers: [MessageService, MensagemAvisoService]
})
export class TipoMovimentacaoComponent extends UtilBasicoModule<ITipoMovimentacao> implements OnInit {

  protected cols: any[] = [];
  protected situacao: { label: string; value: string; }[] = [];
  categorias: ICategoriaMovimentacao[] = [];
  titulo: string = "Tipos de Movimentação Cadastrados";

  constructor(
    private router: Router,
    private categoriaService: CategoriaService,
    tipoMovimentacaoService: TipoMovimentacaoService,
    mensagemAviso: MensagemAvisoService
  ) {
    super(tipoMovimentacaoService, mensagemAviso);
  }

  ngOnInit(): void {
    this.registro.categoria = { id: 1 }; // Inicializando categoria

    this.situacao = this.getSituacaoOpcoes();
    this.carregarCategorias();
    this.carregarLista();
  }

  private carregarCategorias(): void {
    this.categoriaService.listarTodos().subscribe(
      (dados: ICategoriaMovimentacao[]) => {
        console.log(dados);
        this.categorias = dados;
      },
      (err) => this.mensagemAviso.exibirMensagemErro(err)
    );
  }

  getCategoriaByValue(value: number): string {
    const selectedOption = this.categorias.find(option => option.id === value);
    return selectedOption ? selectedOption.dsCategoria : '';
  }

  getLabelByValue(value: string): string {
    const selectedOption = this.situacao.find(option => option.value === value);
    return selectedOption ? selectedOption.label : 'SIM';
  }

  onAbrirTipoMovimentacaoConta(registro: ITipoMovimentacao): void {
    console.log(registro);
    this.router.navigate(['/pages/tipo-movimentacao', registro.id]);
  }
}
