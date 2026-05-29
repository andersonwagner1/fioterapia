import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Inicio',
                items: [
                    { label: 'Principal', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            },
                {
                    label: 'Cadastro',
                    items: [
                        {
                            label: "Calendário",
                            items:[
                                {label: 'Competencia', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/competencia']},
                            ]
                        },
                        {
                            label: "Local",
                            items: [
                                {label: 'Banco', icon: 'pi pi-fw pi-building', routerLink: ['pages/banco']},
                                {label: 'Conta', icon: 'pi pi-fw pi-book', routerLink: ['/pages/conta']},
    
                            ]
                        },
                        {
                            label: "Tipo",
                            items: [
                                {label: 'Categoria', icon: 'pi pi-fw pi-folder', routerLink: ['/pages/categoria']},
                                {label: 'Tipo de Movimentação', icon: 'pi pi-fw pi-shopping-bag', routerLink: ['/pages/tipo-movimentacao']},
                                {label: 'Transferência', icon: 'pi pi-fw pi-arrows-h', routerLink: ['/pages/transferencia']},
                            ],
                        },
                    ]
                },
    
                {
                    label: 'Movimentação',
                    items: [
                        { label: 'Movimentação', icon: 'pi pi-fw pi-wallet', routerLink: ['/pages/movimentacao'] },
                        { label: 'Cartão de Crédito', icon: 'pi pi-fw pi-credit-card', routerLink: ['/pages/cartao-credito'] },
                    ]
                },
                
                {
                    label: 'Investimento',
                    items: [
                        {label: 'Tipo de Investimento', icon: "pi pi-fw pi-money-bill", routerLink:['/pages/investimento']}
                    ]
                },
                {
                    label: 'Validação',
                    items: [
                        {label: 'Validação Fechamento', icon: "pi pi-fw pi-money-bill", routerLink:['/pages/validacaoFinal']},
                        {label: 'Importar', icon: "pi pi-fw pi-money-bill", routerLink:['/pages/importar']}
                    ]
                },
        ];
    }
}
