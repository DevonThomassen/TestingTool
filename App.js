const Url = require('url'), // protocol and split function
  ParseStr = require('xml2js').parseString, // xml reader to json
  Http = require('http'), // http version determine it with url.protocol
  Https = require('https'), // https version determine it with url.protocol
  Request = require('request'),
  Readline = require('readline');// req function

class HttpClient {
  constructor(user) {
    this.username = user.username;
    this.password = user.password;
  }

  get(urlString, onComplete, onError) {

    console.log(urlString)
    let url = new URL(urlString);
    console.log(url);       // <-- redirect it loops again and crashes.....

    // FIXME: Authorization
    let options = {
      host: url.host,
      path: url.pathname,
      // headers: {
      //   'Authorization': 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64')
      // }
    };

    let protocol = url.protocol == 'http:' ? Http : Https;

    let request = protocol.get(url, (res) => {
      let statusCode = res.statusCode;
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (Math.floor(res.statusCode / 100) == 3) {
          this.get(res.headers.location, onComplete, onError);
        }
        else {
          onComplete(new HttpResult(url.href, res.statusCode, data));
        }

      });
    });

    request.on('error', (e) => {
      onError(e);
    });

    request.end();
  }
}

class HttpResult {
  constructor(url, statusCode, body) {
    this.url = url
    this.statusCode = statusCode
    this.body = body
  }
}

class SitemapCrawler {
  constructor(client) {
    this.client = client;
  }

  crawlSitemap(url, onComplete, onError) {
    this.client.get(url, (result) => {
      console.log([result.url, result.statusCode]);

      if (result.statusCode === 404) {
        console.log(`ALERT 404 in -> ${result.url}`);
        return; // or if code 404 avoid fn below -> no data
      }
      let data = ParseStr(result.body, (err, result) => {
        if (!result){
          return;
        }

        let sitemapIndex = SitemapIndex.fromData(result);

        if (sitemapIndex) {
          sitemapIndex.urls.map((sitemapUrl) => {
            this.crawlSitemap(sitemapUrl);
          });
        }
        else {
          // console.log(`sitemapIndex`);
          // console.log(sitemapIndex);
          // TODO: Make actual fromData function
          let sitemap = Sitemap.fromData(result);
          if (sitemap) {
            sitemap.urls.map((document) => {
              this.crawlSitemap(document);
            });
          }
          else {
            console.log('HOE??')
          }
        }
      });
    }, (error) => {
      // TODO: Handle error
    });
  };
}

class SitemapIndex {
  constructor(urls) {
    this.urls = urls
  }

  static fromData(data) {
    if (!data.sitemapindex || !data.sitemapindex.sitemap) {
      return false; // returns false if sitemapindex is possible to make
    }

    let urls = data.sitemapindex.sitemap.map((sitemap) => {
      return sitemap.loc[0];
    });

    return new SitemapIndex(urls);
  }
}

class Sitemap {
  constructor(urls) {
    this.urls = urls;
  }

  static fromData(data) {
    // console.log(data);
    if (!data.urlset || !data.urlset.url) {
      return false;
    }

    let urls = data.urlset.url.map((url) => {
      return url.loc[0];
    });

    return new Sitemap(urls);
  }
}

class Document {
  constructor() {
  }
}

class Image {
  constructor() {
  }
}

(() => {
  const url = 'Place here you url'; 

  const user = {
    username: 'preview',
    password: 'preview',
  }

  let client = new HttpClient(user);
  let sitemapCrawler = new SitemapCrawler(client);
  sitemapCrawler.crawlSitemap(url, (results) => {
    console.log(`Results: `);
    console.log(results);
  }, (error) => {
    // TODO: Handle error
    console.log(error);
  });

})();
