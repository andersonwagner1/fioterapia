import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';
import { Conta } from '../../model/conta';
import { ContaService } from '../../service/conta.service';


@Component({
  selector: 'app-Conta',
  templateUrl: './Conta.component.html',
  styleUrl: './Conta.component.scss',
  providers: [MessageService, MensagemAvisoService]
})
export class ContaComponent extends UtilBasicoModule<Conta> implements OnInit {

    protected cols: any[] = [];
    protected situacao: { label: string; value: string; }[];

    //titulo da pagina
    titulo = "Conta cadastrados";


    /**
     * Construtor
     * @param ContaService
     * @param mensagemAviso
     */
    constructor( contaService : ContaService,  mensagemAviso : MensagemAvisoService) {
        super(contaService, mensagemAviso);

    }


    ngOnInit() {
        //colocar dentro de um extende para caso necessario realizar a carga em um emtodos
        this.situacao = [
            { label: 'Sim', value: 'SIM' },
            { label: 'Não', value: 'NAO' },
        ];

        this.carregarLista();
    }

    /**
     * Exibi o texto dentro do select box (quando receber o valor)
     * @param value
     * @returns
     */
    getLabelByValue(value: string): string {
        const selectedOption = this.situacao.find(option => option.value === value);
        return selectedOption ? selectedOption.label : 'SIM';
    }

    getSituacao(){
        this.situacao = [
            { label: 'Sim', value: 'SIM' },
            { label: 'Não', value: 'NAO' },
        ];
        return this.situacao;
    }
}
