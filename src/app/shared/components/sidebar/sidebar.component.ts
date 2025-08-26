import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

// MDBootstrap
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MdbTooltipModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  

  constructor(
    private cookieService: CookieService,
    private router: Router
  ){

  }

  public icons = [
    // {
    //   src: "assets/icons/sidebar/parachute-box.svg", 
    //   address: "",
    //   alt: "Home"
    // },
    {
      src: "assets/icons/sidebar/house-solid.svg", 
      address: "",
      alt: "Home"
    },
    {
      src: "assets/icons/sidebar/truck-fast-solid.svg", 
      address: "/fornecedores",
      alt: "Fornecedores"
    },
    {
      src: "assets/icons/sidebar/dolly-solid.svg", 
      address: "/produtos",
      alt: "Estoque"
    },
    {
      src: "assets/icons/sidebar/arrow-right-arrow-left-solid.svg", 
      address: "/movimentacoes",
      alt: "Movimentações"
    },
    {
      src: "assets/icons/sidebar/chart-pie-solid.svg", 
      address: "/relatorios",
      alt: "Relatórios"
    },
    {
      src: "assets/icons/sidebar/user-group-solid.svg", 
      address: "/funcionarios",
      alt: "Usuários"
    },
  ]

  logout(){
   this.cookieService.deleteAll()
   this.router.navigate(['/login'])
  }
}
