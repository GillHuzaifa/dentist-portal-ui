import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'dentist-portal-ui';
  
  ngAfterViewInit() {
    // Load the vanilla JS logic after Angular has fully rendered the template
    const script = document.createElement('script');
    script.src = 'assets/app.js';
    document.body.appendChild(script);
  }
}
