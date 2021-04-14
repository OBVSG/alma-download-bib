import { finalize } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CloudAppRestService, Entity } from '@exlibris/exl-cloudapp-angular-lib';
import { download, prettifyXml } from '../utilities/utils';
// @ts-ignore
import { entities as supportedEntities } from '../../../../manifest.json';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  loading = false;
  selectedEntity: Entity = null;
  entityTypes = supportedEntities;

  constructor(
    private restService: CloudAppRestService,
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  download() {
    this.loading = true;
    this.restService.call<any>(this.selectedEntity.link)
    .pipe(finalize(()=>this.loading = false))
    .subscribe(
      bib => download(`${bib.title}.xml`, 'text/xml', prettifyXml(bib.anies))
    )
  }
}