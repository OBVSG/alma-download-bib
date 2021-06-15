import { Injectable } from '@angular/core';
import { InitService } from '@exlibris/exl-cloudapp-angular-lib';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  constructor(private initService: InitService) {}

  /**
   * function to prettify single line of xml code to human readable code
   * @param sourceXml
   * @returns prettified xml or just the source xml
   */
  prettifyXml(sourceXml): string {
    var xmlDoc = new DOMParser().parseFromString(sourceXml, 'application/xml');

    var xsltDoc = new DOMParser().parseFromString(
      [
        // describes how we want to modify the XML - indent everything
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
        '  <xsl:strip-space elements="*"/>',
        '  <xsl:template match="para[content-style][not(text())]">', // change to just text() to strip space in text nodes
        '    <xsl:value-of select="normalize-space(.)"/>',
        '  </xsl:template>',
        '  <xsl:template match="node()|@*">',
        '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
        '  </xsl:template>',
        '  <xsl:output indent="yes"/>',
        '</xsl:stylesheet>'
      ].join('\n'),
      'application/xml'
    );

    try {
      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      var resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      var resultXml = new XMLSerializer().serializeToString(resultDoc);
      return resultXml;
    } catch (e) {
      console.warn('Pretty print XML failed', e.message);
      return sourceXml;
    }
  }

  /**
   * function to create a anchor tag on DOM and use click event to download the url end then removes the element from DOM
   * @param filename
   * @param filetype
   * @param contents
   * @returns boolean which will be used to determine if the process succeed
   */

  downloadAsFile(
    filename: string,
    filetype: string,
    contents: string
  ): boolean {
    try {
      let element = document.createElement('a');
      element.setAttribute(
        'href',
        `data:${filetype};charset=utf-8,` + encodeURIComponent(contents)
      );
      element.setAttribute('download', `${filename}`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      return true;
    } catch (error) {
      console.warn('Download XML File Failed!', error.message);
      return false;
    }
  }
}
