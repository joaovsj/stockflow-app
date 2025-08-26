import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

// Services
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input() titulo: string;
  @Input() icon: string;
  
  name: string;
  role: string;
  img_url: string;

  constructor(
    private cookieService: CookieService
  ){
    this.name = cookieService.get('name')
    this.role = cookieService.get('role')
    this.img_url = cookieService.get('img')
  }


}
