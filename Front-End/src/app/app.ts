import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,ModalModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  standalone: true
})
export class App {
  protected readonly title = signal('frontend');
}
