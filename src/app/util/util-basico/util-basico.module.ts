import { Table } from "primeng/table";
import { catchError, tap, throwError } from "rxjs";
import { Identifiable } from "src/app/conta/model/identifiable";
import { MensagemAvisoService } from "src/app/util/mensagemAviso/mensagem-aviso.service";




export abstract class UtilBasicoModule<T extends Identifiable> {

    telaRegistro: boolean = false;
    telaConfirmacaoRegistroSelecionado: boolean = false;
    telaConfirmacaoExclusao: boolean = false;
    submitted: boolean = false;

    // Registros selecionados e o registro atual
    registrosSelecionados: T[] = [];
    registro= {} as T;

    listaRegistros: T[] = [];

    constructor(protected service: any, protected mensagemAviso: MensagemAvisoService) {}

    /**
     * Carrega a lista de registros
     */
    carregarLista(): void {
        this.service.listar(this.registro).subscribe(
            (dados: T[]) => this.listaRegistros = dados,
            (err: any) => this.mensagemAviso.exibirMensagemErro(err)
        );
    }

    /**
     * Retorna as opções de situação
     */
    getSituacaoOpcoes() {
        return [
            { label: 'Sim', value: 'SIM' },
            { label: 'Não', value: 'NAO' }
        ];
    }

    /**
     * Salva o registro atual
     */
    onSalvarRegistro(): void {
        this.submitted = true;
        console.log("Salvar", this.registro);
        this.service.salvar(this.registro).subscribe(
            () => {
                this.mensagemAviso.exibirMensagemSucesso("Registro salvo com sucesso");
                this.carregarLista();
                this.esconderCaixaDialogo();
            },
            (err: any) => this.mensagemAviso.exibirMensagemErro(err)
        );
    }

    /**Salvar regitro com parametros */
    onSalvarAtualizarRegistro(registro : T): void {
        this.submitted = true;
        this.service.salvar(registro).subscribe(
            () => {
                this.mensagemAviso.exibirMensagemSucesso("Registro salvo com sucesso");
                this.carregarLista();
                this.esconderCaixaDialogo();
            },
            (err: any) => this.mensagemAviso.exibirMensagemErro(err)
        );
    }

    /**
     * Abre a tela de confirmação de exclusão de registros
     */
    onAbrirTelaConfirmacaoExclusao(): void {
        this.telaConfirmacaoExclusao = true;
    }

    /**
     * Abre a tela para inserir um novo registro
     */
    onAbrirTelaNovoRegistro(): void {
        this.submitted = false;
        this.telaRegistro = true;
        console.log("mostrar", this.registro);
    }

    /**
     * Abre a tela de confirmação de exclusão de um registro selecionado
     * @param reg Registro selecionado
     */
    onConfirmarExclusaoRegistroSelecionado(reg: T): void {
        this.telaConfirmacaoRegistroSelecionado = true;
        this.registro = { ...reg };
    }

    /**
     * Filtragem rápida nos dados da tabela
     * @param table Tabela a ser filtrada
     * @param event Evento de input
     */
    onFiltragemRapida(table: Table, event: Event): void {
        const valor = (event.target as HTMLInputElement).value;
        table.filterGlobal(valor, 'contains');
    }

    /**
     * Confirma a exclusão dos registros selecionados
     */
    onConfirmarExclusaoRegistrosSelecionados(): void {
        this.telaConfirmacaoExclusao = false;
        this.service.excluir(this.registrosSelecionados).subscribe(
            () => {
                this.mensagemAviso.exibirMensagemSucesso("Registros excluídos com sucesso");
                this.carregarLista();
            },
            (err: any) => this.mensagemAviso.exibirMensagemErro(err)
        );
    }

    /**
     * Esconde a caixa de diálogo de registro
     */
    esconderCaixaDialogo(): void {
        this.telaRegistro = false;
        this.submitted = false;
    }

    /**
     * Abre a tela de edição de um registro existente
     * @param registro Registro a ser editado
     */
    onEditarRegistro(registro: T): void {




        this.carregarRegistro(registro.id);
        this.telaRegistro = true;
    }

    /**
     * Carrega um registro pelo ID
     * @param id ID do registro
     */
    private carregarRegistro(id: number): void {
      /*  return this.service.getPorId(id).pipe(
            tap((dado: T) => {
                this.registro = dado;  // Atribui o registro ao objeto local
                console.log("Registro carregado:", this.registro);
            }),
            catchError((err: any) => {
                this.mensagemAviso.exibirMensagemErro(err);
                return throwError(err);
            })
        );
*/

        this.service.getPorId(id).subscribe(
            (dado: T) => {
                console.log("registro" , dado);
                this.registro = dado
            },
            (err: any) => this.mensagemAviso.exibirMensagemErro(err)
        );
    }

    /**
     * Confirma a exclusão de um registro
     */
    confirmarExclusaoRegistro(): void {
        this.telaConfirmacaoRegistroSelecionado = false;
        this.service.excluir(this.registro).subscribe(
            () => {
                this.mensagemAviso.exibirMensagemSucesso("Registro excluído com sucesso");
                this.carregarLista();
            },
            (err: any) => this.mensagemAviso.exibirMensagemErro(err)
        );
    }
}
