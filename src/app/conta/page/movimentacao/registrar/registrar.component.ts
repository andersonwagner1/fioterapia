import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// PrimeNG Modules
import { AutoComplete, AutoCompleteModule } from 'primeng/autocomplete';
import { InputGroupModule } from 'primeng/inputgroup';
import { PanelModule } from 'primeng/panel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CardModule } from 'primeng/card';

// Routing
import { MovimentacaoRoutingModule } from '../movimentacao-routing.module';

// Models
import { ITipoMovimentacao } from 'src/app/conta/model/i-tipo-movimentacao';
import { IInvestimento } from 'src/app/conta/model/i-investimento';
import { ITransferencia } from 'src/app/conta/model/i-transferencia';
import { IMovimentacaoFinal } from 'src/app/conta/model/i-movimentacao-final';

// Services
import { TipoMovimentacaoService } from 'src/app/conta/service/tipo-movimentacao.service';
import { InvestimentoService } from 'src/app/conta/service/investimento.service';
import { TransferenciaService } from 'src/app/conta/service/transferencia.service';
import { MovimentacaoService } from 'src/app/conta/service/movimentacao.service';
import { BancoContaService } from 'src/app/conta/service/banco-conta.service'; // Adicionado
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG Imports (mantendo todos que você tinha para garantir que nada quebre)
    AutoCompleteModule, InputGroupModule, SelectButtonModule, MovimentacaoRoutingModule,
    TableModule, FileUploadModule, ButtonModule, RippleModule, ToastModule, ToolbarModule,
    RatingModule, InputTextModule, InputTextareaModule, DropdownModule, RadioButtonModule,
    InputNumberModule, DialogModule, InputMaskModule, PanelModule, CheckboxModule,
    CardModule, InputSwitchModule, 
  ],
  templateUrl: './registrar.component.html',
  styleUrl: './registrar.component.scss'
})
export class RegistrarComponent implements OnInit, OnChanges {

  @Input() registro: any; // Ajuste o tipo se houver um IRegistro
  @Input() permitirNovosRegistro: boolean; // Mantive o Boolean com 'b' minúsculo
  @Output() evAtualizar = new EventEmitter<boolean>();
  @ViewChild('meuAutoComplete') autoComplete!: AutoComplete;

  formulario!: FormGroup;

  listarInvestimentos: IInvestimento[] = [];
  listarBancosParaTransferencia: ITransferencia[] = [];
  listarTipoMovimentacao: ITipoMovimentacao[] = [];
  listaSituacoes: any[] = [{ value: 'NAO', label: "Não" }, { value: 'SIM', label: "Sim" }];

  // Flags de Exibição (melhoramos o uso no template)
  mostrarCampoCredito: boolean = false;
  mostrarCampoDebito: boolean = false;
  mostrarCampoTransferencia: boolean = false;
  mostrarCampoAplicacao: boolean = false;

  // Modais
  mostrarSaldo: boolean = false;
  mostrarBancoConta: boolean = false;
  mostrarCompetencia: boolean = false;

  novoSaldo: number | null = null;
  competenciaId: number | null = null;
  bancoContaId: number | null = null;

  // Variável para desabilitar o campo 'repetir'
  desabilitarCampoRepetir: boolean = false;
  submitted: boolean = false; // Adicionado para simular o submit e exibir validação

  constructor(
    private tipoMovimentacaoService: TipoMovimentacaoService,
    private investimentoService: InvestimentoService,
    private movimentacaoService: MovimentacaoService,
    private mensagemAviso: MensagemAvisoService,
    private fb: FormBuilder,
    private transferenciaService: TransferenciaService,
    private bancoContaService: BancoContaService // Adicionado
  ) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      id: [{ value: null, disabled: true }],
      competencia: [null],
      bancoConta: [null],
      tipoMovimentacao: [null, Validators.required],
      vinculado: [null],
      investimento: [null],
      nrPosicao: [null],
      dtMovimentacao: [null],
      nrDia: [null, Validators.required],
      vlCredito: [null],
      vlDebito: [null],
      vlSaldo: [null],
      dsObservacao: [null],
      icCalcular: ['SIM', Validators.required],
      icSituacao: ['SIM'],
      repetir: [1, Validators.min(1)]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.registro) {
      this.formulario.patchValue(this.registro);
      // É importante garantir que os dados do registro sejam usados para carregar as listas iniciais
      this.onSelecionadoTipoMovimentacao();
    }
  }

  /**
   * Atualiza a visibilidade dos campos com base no tipo de movimentação.
   */
  onSelecionadoTipoMovimentacao(): void {
    const tipoMovimentacao = this.formulario.get('tipoMovimentacao')?.value as ITipoMovimentacao;

    if (!tipoMovimentacao || !tipoMovimentacao.icTipoMovimentacao) {
      this.resetCamposCondicionais();
      return;
    }

    const tipo = tipoMovimentacao.icTipoMovimentacao;

    this.mostrarCampoTransferencia = ['TRANSFERENCIA', 'APLICACAO', 'RESGATE'].includes(tipo);
    this.mostrarCampoAplicacao = ['APLICACAO', 'RESGATE'].includes(tipo);
    this.mostrarCampoCredito = ['CREDITO', 'RESGATE'].includes(tipo);
    this.mostrarCampoDebito = ['APLICACAO', 'DEBITO', 'TRANSFERENCIA'].includes(tipo);

    // Ajusta os validadores e valores
    if (this.mostrarCampoCredito) {
      this.formulario.get('vlCredito')?.setValidators(Validators.required);
      this.formulario.get('vlDebito')?.patchValue(null);
      this.formulario.get('vlDebito')?.clearValidators();
    } else if (this.mostrarCampoDebito) {
      this.formulario.get('vlDebito')?.setValidators(Validators.required);
      this.formulario.get('vlCredito')?.patchValue(null);
      this.formulario.get('vlCredito')?.clearValidators();
    } else {
      this.formulario.get('vlCredito')?.clearValidators();
      this.formulario.get('vlDebito')?.clearValidators();
    }
    this.formulario.get('vlCredito')?.updateValueAndValidity();
    this.formulario.get('vlDebito')?.updateValueAndValidity();

    // Lógica para desabilitar "Repetir"
    this.desabilitarCampoRepetir = this.mostrarCampoTransferencia;
    if (this.desabilitarCampoRepetir) {
      this.formulario.get('repetir')?.patchValue(1);
    }
    
    // Carrega a lista de bancos para transferência se o campo for exibido
    if (this.mostrarCampoTransferencia && this.registro?.bancoConta) {
      this.carregarBancosParaTransferencia(this.registro.bancoConta);
    } else {
      this.listarBancosParaTransferencia = [];
    }

    // Limpa investimentos se não for o caso
    if (!this.mostrarCampoAplicacao) {
      this.formulario.get('investimento')?.patchValue(null);
      this.listarInvestimentos = [];
    }
  }

  resetCamposCondicionais(): void {
    this.mostrarCampoTransferencia = false;
    this.mostrarCampoAplicacao = false;
    this.mostrarCampoCredito = false;
    this.mostrarCampoDebito = false;
    this.desabilitarCampoRepetir = false;
    this.formulario.get('vlCredito')?.patchValue(null);
    this.formulario.get('vlDebito')?.patchValue(null);
    this.formulario.get('vinculado')?.patchValue(null);
    this.formulario.get('investimento')?.patchValue(null);
    this.formulario.get('repetir')?.patchValue(1);
    this.listarBancosParaTransferencia = [];
    this.listarInvestimentos = [];
  }

  carregarBancosParaTransferencia(bancoContaOrigem: any): void {
    this.transferenciaService.listarTransferenciaPorBancoConta(bancoContaOrigem).subscribe(
      data => {
        this.listarBancosParaTransferencia = data.map(transferirPara => ({
          ...transferirPara,
          label: `${transferirPara.transferirPara.banco.dsBanco} - ${transferirPara.transferirPara.conta?.dsConta}`
        }));
      },
      err => this.mensagemAviso.exibirMensagemErro(err)
    );
  }

  /**
   * Chamado ao selecionar a transferência para carregar os investimentos.
   */
  onSelecionarTransferencia(): void {
    const transferenciaSelecionada = this.formulario.get('vinculado')?.value; 
    
   /* if (!transferenciaSelecionada || !transferenciaSelecionada.transferirPara) {
      this.listarInvestimentos = [];
      return;
    }
*/
const bancoId = transferenciaSelecionada.banco.id;
const contaId = transferenciaSelecionada.conta.id;
   // const bancoId = transferenciaSelecionada.transferirPara.banco.id;
   // const contaId = transferenciaSelecionada.transferirPara.conta.id;

    if (this.mostrarCampoAplicacao) {
      this.investimentoService.listarInvestimentoPorBancoConta(bancoId, contaId).subscribe(
        data => {
          this.listarInvestimentos = data.map(tipoInvestimento => ({
            ...tipoInvestimento,
            valor: tipoInvestimento, // Mantém o objeto completo no valor
            label: `(${tipoInvestimento.id}) - ${tipoInvestimento.dsInvestimento}`
          }));
        },
        err => this.mensagemAviso.exibirMensagemErro(err)
      );
    }
  }

  /**
   * Busca tipos de movimentação para o p-autoComplete.
   */
  filtrarTipoMovimentacaoPorNome(event: any): void {
    const query = event.query;
    this.tipoMovimentacaoService.listaTipoMovimentacaoPorNome(query).subscribe(
      data => {
        this.listarTipoMovimentacao = data.map(tipoMovimentacao => ({
          ...tipoMovimentacao,
          dsTipoMovimentacao: `${tipoMovimentacao.id} - ${tipoMovimentacao.dsTipoMovimentacao}`
        }));
      },
      err => this.mensagemAviso.exibirMensagemErro(err)
    );
  }

  /**
   * Reseta o formulário para um novo registro.
   */
  onNovo(): void {
    this.formulario.reset({
      icCalcular: 'SIM',
      icSituacao: 'SIM',
      repetir: 1 // Garante que o campo repetir volte para 1
    });
    this.resetCamposCondicionais();
    this.submitted = false;
  }

  /**
   * Abre o modal de alteração de competência.
   */
  onAbrirCompetencia(): void {
    this.competenciaId = this.registro.competencia.id;
    this.bancoContaId = this.registro.bancoConta.id;
    this.mostrarCompetencia = true;
  }

  /**
   * Abre o modal de alteração de banco/conta.
   */
  onAbrirBancoConta(): void {
    this.competenciaId = this.registro.competencia.id;
    this.bancoContaId = this.registro.bancoConta.id;
    this.mostrarBancoConta = true;
  }

  /**
   * Salva a alteração de competência/banco (lógica que parece vir de outro componente/contexto).
   */
  onSalvarAlteracao(): void {
    const id = this.formulario.get('id')?.value;
    if (id && this.competenciaId !== null && this.bancoContaId !== null) {
      // O endpoint original não está recebendo o ID do registro no serviço, mas a chamada
      // do componente sugere que ele altera o banco/competência do REGISTRO atual.
      this.movimentacaoService.alterarBancoCompetencia(id, this.competenciaId, this.bancoContaId).subscribe(
        () => {
          this.mensagemAviso.exibirMensagemSucesso("Alteração salva com sucesso.");
          this.mostrarCompetencia = false;
          this.mostrarBancoConta = false;
          this.evAtualizar.emit(true);
        },
        err => this.mensagemAviso.exibirMensagemErro(err)
      );
    } else {
      this.mensagemAviso.exibirMensagemErroString("ID da movimentação, competência ou banco/conta não fornecido.");
    }
  }

  /**
   * Salva o novo registro de movimentação.
   */

// registrar.component.ts - onSalvarRegistroMovimentacao()

onSalvarRegistroMovimentacao(): void {
    // ... validações ...

    let registro = this.formulario.getRawValue();
    registro.bancoConta = this.registro.bancoConta;
    registro.competencia = this.registro.competencia;
    
    // Modificação para enviar a referência do TipoMovimentacao
    const tipoMovimentacaoSelecionado = registro.tipoMovimentacao;
    if (tipoMovimentacaoSelecionado && tipoMovimentacaoSelecionado.id) {
        registro.tipoMovimentacao = {
            id: tipoMovimentacaoSelecionado.id
        };
    } else {
        registro.tipoMovimentacao = null; // Ou um objeto vazio, dependendo da obrigatoriedade
    }

    // ... lógica para campos vinculados (usando a mesma lógica se for enviar apenas o ID)
    //const vinculadoSelecionado = registro.vinculado;
    /*if (vinculadoSelecionado && registro.vinculado) {
        registro.vinculado = { id: vinculadoSelecionado.transferirPara.id }; 
    } else {
        registro.vinculado = null;
    }*/




    // ... lógica para campos investimento (usando a mesma lógica se for enviar apenas o ID)
    /*const investimentoSelecionado = registro.investimento;
    if (investimentoSelecionado && investimentoSelecionado.id) {
        registro.investimento = { id: investimentoSelecionado.id };
    } else {
        registro.investimento = null;
    }*/


    // ... lógica para valores nulos ...

   this.movimentacaoService.salvarMovimentacao(registro).subscribe(() => {
      this.mensagemAviso.exibirMensagemSucesso("Registro salvo com sucesso.");
      this.onNovo(); // Reseta o formulário
      this.evAtualizar.emit(true);
    },
      err => this.mensagemAviso.exibirMensagemErro(err)
    );
}

  onSalvarRegistroMovimentacao1(): void {
    this.submitted = true;

   /* if (this.formulario.invalid) {
      this.mensagemAviso.exibirMensagemErroString("Verifique os campos obrigatórios.");
      return;
    }*/

    let registro = this.formulario.getRawValue(); // Usa getRawValue para incluir 'id' desabilitado se necessário
    registro.bancoConta = this.registro.bancoConta;
    registro.competencia = this.registro.competencia;
    
    // Lógica para enviar apenas o ID para campos complexos (se o backend exigir)
    registro.tipoMovimentacao = registro.tipoMovimentacao ? registro.tipoMovimentacao.id : null;
    registro.vinculado = registro.vinculado ? registro.vinculado.transferirPara : null; // Envia o BancoConta de destino/origem
    registro.investimento = registro.investimento ? registro.investimento : null; // Envia o objeto investimento completo (ajuste conforme API)

    // Ajusta vlCredito/vlDebito para 0 se estiver nulo e o campo estiver visível
    if(this.mostrarCampoCredito && registro.vlCredito === null) registro.vlCredito = 0;
    if(this.mostrarCampoDebito && registro.vlDebito === null) registro.vlDebito = 0;
    
    // Removendo campos que devem ser nulos antes de enviar (se for a regra da API)
    if(!this.mostrarCampoCredito) delete registro.vlCredito;
    if(!this.mostrarCampoDebito) delete registro.vlDebito;
    if(!this.mostrarCampoTransferencia && !this.mostrarCampoAplicacao) {
      delete registro.vinculado;
      delete registro.investimento;
    }


    this.movimentacaoService.salvarMovimentacao(registro).subscribe(() => {
      this.mensagemAviso.exibirMensagemSucesso("Registro salvo com sucesso.");
      this.onNovo(); // Reseta o formulário
      this.evAtualizar.emit(true);
    },
      err => this.mensagemAviso.exibirMensagemErro(err)
    );
  }

  /**
   * Abre o modal de registro de novo saldo.
   */
  onAbrirSaldo(): void {
    this.novoSaldo = null;
    this.mostrarSaldo = true;
  }

  /**
   * Salva o novo saldo final para a competência/conta.
   */
  onSalvarNovoSaldo(): void {
    if (this.novoSaldo === null) {
      this.mensagemAviso.exibirMensagemErro("O valor do saldo é obrigatório.");
      return;
    }

    const registro: IMovimentacaoFinal = {
      bancoConta: this.registro.bancoConta,
      competencia: this.registro.competencia,
      vlSaldoFinal: this.novoSaldo
    };

    this.movimentacaoService.calcularSaldoFinal(registro).subscribe(
      () => {
        this.mensagemAviso.exibirMensagemSucesso("Novo saldo final salvo com sucesso.");
        this.mostrarSaldo = false;
        this.evAtualizar.emit(true);
      },
      err => this.mensagemAviso.exibirMensagemErro(err)
    );
  }
}