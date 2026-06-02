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
                    label: 'Prontuario',
                    items: [
                        {
                            label: "Pesquisar Prontuario", routerLink: ['/pages/lista-prontuario'], icon: 'pi pi-fw pi-search'  
                           
                        },

                        {
                            label: "Novo Prontuario", routerLink: ['/pages/prontuario'], icon: 'pi pi-fw pi-plus'  
                           
                        },
                        {
                            label: "Agenda", routerLink: ['/pages/agendamentos'], icon: 'pi pi-fw pi-calendar'
                        },
                
                    ]  
                }, 
    
                
        ];
    }
}
