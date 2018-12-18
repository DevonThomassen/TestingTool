import { Sitemap } from './Sitemap';
import { SitemapIndex } from './SitemapIndex';
import { Doc } from './Document';
import { parseStr as ParseStr } from 'xml2js';
import { HttpClient } from './HttpClient';
import { HttpRequest } from './HttpRequest';
import { HttpResult } from './HttpResult';

class SitemapCrawler {
  client: HttpClient;
  onComplete: Function;
  operations: number;
  results: HttpResult[];
  errors: string[];
  uniqueUrls: string[];

  constructor(client: HttpClient, onComplete: (results: HttpResult[], errors: String[]) => void) {
    this.client = client;
    this.onComplete = onComplete;
    this.operations = 0;
    this.results = [];
    this.errors = [];
    this.uniqueUrls = [];
  }

  incrementOperations() {
    this.operations++;
  }

  decrementOperations() {
    this.operations--;

    if (this.operations < 1) {
      this.complete()
    }
  }

  complete() {
    this.onComplete(this.results, this.errors);
  }

  crawlSitemap(url) {
    this.incrementOperations();
    
    this.client.queue(url, (result) => {

      if (result.isSuccess()) {
        ParseStr(result.body, (_err: Array<string>, result: Array<string>) => {
          let sitemapIndex = SitemapIndex.fromData(result);
          let sitemap = Sitemap.fromData(result);

          console.log(sitemapIndex);
          if (sitemapIndex) {
            sitemapIndex.urls.map((sitemapUrl:string) => {
              this.crawlSitemap(sitemapUrl);
            });
          } else if (sitemap) {
            sitemap.documents.map((document) => {
              if (this.uniqueUrls.indexOf(document.url) !== -1) {
                return;
              }

              this.uniqueUrls.push(document.url);
              this.incrementOperations();

              this.client.queue(document.url, (result) => {
                result.checkMixedContent();
                delete result.body;
                this.results.push(result);
                this.decrementOperations();
              }, (error) => {
                this.errors.push('Could not fetch document `' + document.url + '`. Error: ' + error + '');
                this.decrementOperations();
              });

              document.images.map((image) => {
                if (this.uniqueUrls.indexOf(image.url) !== -1) {
                  return;
                }
                this.uniqueUrls.push(image.url);
                this.incrementOperations();

                this.client.queue(image.url, (result) => {
                  delete result.body;
                  this.results.push(result);
                  this.decrementOperations();
                }, (error) => {
                  this.errors.push('Could not fetch image `' + document.url + '`. Error: ' + error + '');
                  this.decrementOperations();
                });
              });
            });
          } else {
            this.errors.push(`Invalid sitemap: '${url}'`);
          }
          this.decrementOperations();
        });
      } else if (result.statusCode == 401) {
        this.errors.push(`You are unauthorized for this webpage: "${url}"`);
        this.decrementOperations();
      } else {
        this.errors.push('Could not fetch sitemap `' + url + '`. Error: ' + result.statusCode + '');
        this.decrementOperations();
      }
    }, (error) => {
      this.errors.push('Could not fetch sitemap `' + url + '`. Error: ' + error + '');
      this.decrementOperations();
    });
  };
}