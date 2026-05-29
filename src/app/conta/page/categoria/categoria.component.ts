import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MensagemAvisoService } from 'src/app/util/mensagemAviso/mensagem-aviso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategoriaMovimentacao } from '../../model/i-categoria-movimentacao';

import { UtilBasicoModule } from 'src/app/util/util-basico/util-basico.module';
import { CategoriaService } from '../../service/categoria.service.';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'], // Corrigido de 'styleUrl' para 'styleUrls'
  providers: [MessageService, MensagemAvisoService]
})
export class CategoriaComponent extends UtilBasicoModule<ICategoriaMovimentacao> implements OnInit {
    protected cols: any[] = [];
    protected situacao: { label: string; value: string; }[] = [];
    protected tipos: { label: string; value: string; }[] = [];

    titulo = "Categorias Cadastradas";

    constructor(
        private router: Router,
        categoriaService: CategoriaService,
        mensagemAviso: MensagemAvisoService
    ) {
        super(categoriaService, mensagemAviso);
    }

    ngOnInit(): void {
        this.situacao = this.getSituacaoOpcoes();
        this.tipos = [
            { label: 'Crédito', value: 'C' },
            { label: 'Débito', value: 'D' },
            { label: 'Movimentação (+)', value: 'TC' },
            { label: 'Movimentação (-)', value: 'TD' },
            { label: 'Aplicaçaõ', value: 'A' },
            { label: 'Resgate', value: 'R' }            
        ];
        this.carregarLista();
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
