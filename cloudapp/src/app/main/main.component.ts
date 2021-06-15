import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  CloudAppEventsService,
  Entity,
  PageInfo
} from '@exlibris/exl-cloudapp-angular-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  /**
   * private property to hold the subscription to the loaded page on alma page
   */
  private pageLoad$: Subscription;

  /**
   * store the fetched entities from alma page in this property
   * @type {Entity[]}
   */
  entitiesFromPageOnLoad: Entity[];

  constructor(private eventsService: CloudAppEventsService) {}

  /**
   * handler function for the default onPageLoad method of the event service
   * @param pageInfo
   */
  onPageLoadHandler = (pageInfo: PageInfo) => {
    this.entitiesFromPageOnLoad = pageInfo.entities || [];
  };

  ngOnInit(): void {
    /**
     * subscribe to the page load observable on component initialization
     */
    this.pageLoad$ = this.eventsService.onPageLoad(this.onPageLoadHandler);
  }

  ngOnDestroy(): void {
    /**
     * good practice to unsubscribe unnecessary subscriptions
     */
    this.pageLoad$.unsubscribe();
  }
}
