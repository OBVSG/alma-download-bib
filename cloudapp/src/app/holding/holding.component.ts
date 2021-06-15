import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  CloudAppRestService,
  Request
} from '@exlibris/exl-cloudapp-angular-lib';
import { AppService } from './../app.service';
import { HoldingItem } from '../models/holding-item.interface';

@Component({
  selector: 'app-holding',
  templateUrl: './holding.component.html',
  styleUrls: ['./holding.component.scss']
})
export class HoldingComponent implements OnInit {
  /**
   * property to decide to show loading spinner by loading the data from alma server
   */
  loading = true;

  /**
   * property to store the retrieved param from route for holding_id
   */
  holdingId: string;

  /**
   * property to store the retrieved param from route for mms_id
   * used to navigate back to the bib record route
   */
  bibId: string;

  /**
   * store fetched holding record from alma Api to the property with the type of Bib
   * used for template to show some optional properties
   */
  currentHoldingJson: HoldingItem;

  /**
   * store the fetched holding record as string(any) to download later
   */
  currentHoldingXml: any;

  /**
   * store the fetched holding/items record as string(any) to download later
   */
  itemsXml: any;

  constructor(
    private appService: AppService,
    private restService: CloudAppRestService,
    private route: ActivatedRoute,
    private alert: AlertService
  ) {}

  /**
   * private handler function to use in multiple places to send a GET request to Alma api and subscribe to it later an do some actions with fetched data and the response
   * @param request of type Request from @exlibris/exl-cloudapp-angular-lib
   * @returns response observable from alma api
   */
  private sendRequestHandler(request: Request) {
    this.loading = true;
    return this.restService.call<any>(request);
  }

  ngOnInit(): void {
    /**
     * retrieve the route parameter which holds the mms_id sent from /bib route
     */
    this.bibId = this.route.snapshot.params['bibId'];

    /**
     * retrieve the route parameter which holds the holding_id sent from /bib route
     */
    this.holdingId = this.route.snapshot.params['holdingId'];

    const url = `/almaws/v1/bibs/${this.bibId}/holdings/${this.holdingId}
`;

    /**
     * create a request object based on @exlibris request specifications
     * url specifies the endpoint to fetch a single holding record as application/json
     */
    const holdingsRecordRequest: Request = {
      url
    };

    /**
     * create a request object based on @exlibris request specifications
     * url specifies the endpoint to fetch a single holding record as application/xml
     */
    const holdingsXmlRequest: Request = {
      url,
      headers: {
        Accept: 'application/xml'
      }
    };

    /**
     * create a request object based on @exlibris request specifications
     * url specifies the endpoint to fetch holding/items record as application/xml
     */
    const itemsXmlRequest: Request = {
      url: `${url}/items`,
      headers: {
        Accept: 'application/xml'
      }
    };

    /**
     * fetch the single holding record and store in property
     */
    this.sendRequestHandler(holdingsRecordRequest).subscribe(
      holdingsJson => {
        this.currentHoldingJson = { ...holdingsJson };
        this.loading = false;
      },
      error => {
        this.alert.error(
          `Failed to fetch HOLDINGS Json record! ${error.message}`,
          {
            autoClose: false
          }
        );
      }
    );

    /**
     * fetch the single holding record (whole as text/xml)and store in property
     */
    this.sendRequestHandler(holdingsXmlRequest).subscribe(
      holdingsXml => {
        this.currentHoldingXml = holdingsXml;
        this.loading = false;
      },
      error => {
        this.alert.error(
          `Failed to fetch HOLDINGS XML record! ${error.message}`,
          {
            autoClose: false
          }
        );
      }
    );

    /**
     * fetch the single holding/items record (whole as text/xml)and store in property
     */
    this.sendRequestHandler(itemsXmlRequest).subscribe(
      itemsXml => {
        this.itemsXml = itemsXml;
        this.loading = false;
      },
      error => {
        this.alert.error(`Failed to fetch ITEMS XML record! ${error.message}`, {
          autoClose: false
        });
      }
    );
  }

  /**
   * function to download the value stored in holding.anies property as xml
   * and download the file
   */
  downloadHoldingAnies(): void {
    this.currentHoldingJson.anies.forEach((element, index) => {
      const content = this.appService.prettifyXml(element);

      const downloadProcessResult = this.appService.downloadAsFile(
        `${this.holdingId}_HOLDING_Anies_${index}.xml`,
        'text/xml',
        content
      );

      if (downloadProcessResult) {
        this.alert.success(`HOLDING Anies record downloaded successfully`);
      } else {
        this.alert.error('Failed to download the HOLDING Anies record!', {
          autoClose: false
        });
      }
    });
  }

  /**
   * function to download the whole holding record property as xml
   * and download the file
   */
  downloadHoldingXml(): void {
    const content = this.appService.prettifyXml(this.currentHoldingXml);

    const downloadProcessResult = this.appService.downloadAsFile(
      `${this.holdingId}_HOLDINGS_XML.xml`,
      'text/xml',
      content
    );

    if (downloadProcessResult) {
      this.alert.success(`HOLDING XML record downloaded successfully`);
    } else {
      this.alert.error('Failed to download the HOLDING XML record!', {
        autoClose: false
      });
    }
  }

  /**
   * function to download the whole holding/items record property as xml
   * and download the file
   */
  downloadItemsXml(): void {
    const content = this.appService.prettifyXml(this.itemsXml);

    const downloadProcessResult = this.appService.downloadAsFile(
      `${this.holdingId}_ITEMS_XML.xml`,
      'text/xml',
      content
    );

    if (downloadProcessResult) {
      this.alert.success(`ITEMS XML record downloaded successfully`);
    } else {
      this.alert.error('Failed to download the ITEMS XML record!', {
        autoClose: false
      });
    }
  }
}
