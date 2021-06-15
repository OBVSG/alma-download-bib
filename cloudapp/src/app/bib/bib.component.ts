import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  AlertService,
  CloudAppRestService,
  Request
} from '@exlibris/exl-cloudapp-angular-lib';
import { AppService } from './../app.service';
import { Bib } from '../models/bib.interface';
import { HoldingList } from '../models/holding-list.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bib',
  templateUrl: './bib.component.html',
  styleUrls: ['./bib.component.scss']
})
export class BibComponent implements OnInit {
  /**
   * property to decide to show loading spinner by loading the data from alma server
   */
  loading = true;

  /**
   * store fetched bib record from alma Api to the property with the type of Bib
   * used for template to show some optional properties
   */
  currentBibJson: Bib = null;

  /**
   * property to decide to show holdings list
   */
  showHoldings = false;

  /**
   * list of active holdings which is shown on template as a list
   */
  currentHoldings: HoldingList[];

  /**
   * store the fetched bib record as string(any) to download later
   */
  currentBibXml: any;

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
  private sendRequestHandler(request: Request): Observable<any> {
    this.loading = true;
    return this.restService.call<any>(request);
  }

  ngOnInit(): void {
    /**
     * retrieve the route parameter which holds the mms_id sent from home page route
     */
    const mmsId = this.route.snapshot.params['bibId'];

    const url = `/bibs/${mmsId}`;

    /**
     * create a request object based on @exlibris request specifications
     * url specifies the endpoint to fetch a single bib record as application/json
     */
    const bibRecordRequest: Request = {
      url
    };

    /**
     * create a request object based on @exlibris request specifications
     * url specifies the endpoint to fetch a single bib record as application/xml
     */
    const bibXmlRequest: Request = {
      url,
      headers: {
        Accept: 'application/xml'
      }
    };

    /**
     * fetch the single bib record and store in property
     */
    this.sendRequestHandler(bibRecordRequest).subscribe(
      bibJson => {
        this.currentBibJson = { ...bibJson };
        this.loading = false;
      },
      error => {
        this.alert.error(`Failed to fetch BIB Json record! ${error.message}`, {
          autoClose: false
        });
      }
    );

    /**
     * fetch the single bib record (whole as text/xml)and store in property
     */
    this.sendRequestHandler(bibXmlRequest).subscribe(
      bibXml => {
        this.currentBibXml = bibXml;
        this.loading = false;
      },
      error => {
        this.alert.error(`Failed to fetch BIB XML record! ${error.message}`, {
          autoClose: false
        });
      }
    );
  }

  /**
   * function to download the value stored in bib.anies property as xml
   * and download the file
   */
  downloadBibJson(): void {
    this.currentBibJson.anies.forEach((element, index) => {
      const content = this.appService.prettifyXml(element);

      const downloadProcessResult = this.appService.downloadAsFile(
        `${this.currentBibJson.mms_id}_BIB_Anies_${index}.xml`,
        'text/xml',
        content
      );

      if (downloadProcessResult) {
        this.alert.success(`BIB Anies record downloaded successfully`);
      } else {
        this.alert.error('Failed to download the BIB Anies record!', {
          autoClose: false
        });
      }
    });
  }

  /**
   * function to download the whole bib record property as xml
   * and download the file
   */
  downloadBibXml(): void {
    const content = this.appService.prettifyXml(this.currentBibXml);

    const downloadProcessResult = this.appService.downloadAsFile(
      `${this.currentBibJson.mms_id}_BIB_XML.xml`,
      'text/xml',
      content
    );

    if (downloadProcessResult) {
      this.alert.success(`BIB XML record downloaded successfully`);
    } else {
      this.alert.error('Failed to download the BIB XML record!', {
        autoClose: false
      });
    }
  }

  /**
   * fetches the list of holding based on the bib mms_id
   * and store it on property
   */
  getHoldingsList(): void {
    const holdingsListRequest: Request = {
      url: this.currentBibJson.holdings.link
    };

    this.sendRequestHandler(holdingsListRequest).subscribe(
      response => {
        this.currentHoldings = [...response.holding];
        this.loading = false;
        this.showHoldings = true;
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
  }
}
