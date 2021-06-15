import { Component, OnInit } from '@angular/core';
import { CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private eventsService: CloudAppEventsService) {}

  ngOnInit(): void {}

  /**
   * default event service method to reset the alma page
   */
  refreshAlma() {
    this.eventsService.home().subscribe();
  }
}
