import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ConstantesModule<T>  {


    protected cols: any[] = [];
    protected situacao: { label: string; value: string; }[];

    //titulo da pagina
    titulo = "Banco cadastrados";

    //tabela de registro
    listaRegistros: T[] = [];

    //reigstro que foi selecionado
    registrosSelecionados : T[] = [];
    registro = {} as  T;



    telaRegistro: boolean = false;
    telaConfirmacaoRegitroSelecionado: boolean = false;
    telaConfirmacaoExclucao: boolean = false;
    submitted: boolean = false;

    getLabelByValue(value: string): string {
        const selectedOption = this.situacao.find(option => option.value === value);
        return selectedOption ? selectedOption.label : 'SIM';
      }

    getSituacao(){
        this.situacao = [
            { label: '(Selecione)', value: '' },
            { label: 'Sim', value: 'SIM' },
            { label: 'Não', value: 'NAO' },
        ];
        return this.situacao;
    }

    setTituloTela(titulo :string){
        this.titulo = titulo;
    }

    /**
     * Abrir tela de confirmação de exclusão de registros
     */

    onAbrirTelaConfirmacaoExclucaoRegistro() {
        this.telaConfirmacaoExclucao = true;
    }

        /**
     * Abrir tela para inserir novo registro
     */
    //IMPLEMENTS
    //vericar se consigo colocar no extentes (passando uma variavel T)
    onAbrirTelaNovoRegistro() {

        console.log("abrir");
        this.submitted = false;
        this.telaRegistro = true;
    }




onConfirmarExclucaoRegistro(banco: T) {
    this.telaConfirmacaoRegitroSelecionado = true;
    this.registro = { ...banco };
}



//EXTENTES
esconderCaixaDialogo  () {
    console.log("esconder");
    this.telaRegistro = false;
    this.submitted = false;
}





}
