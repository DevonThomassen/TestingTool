const Url = require('url'),
  ParseStr = require('xml2js').parseString,
  Http = require('http'),
  Https = require('https'),
  {performance} = require('perf_hooks');

class HttpClient {
  constructor(user) {
    this.username = user.username;
    this.password = user.password;
    this.requests = [];
    this.operations = 0;
  }

  queue(urlStr, onComplete, onError) {
    this.requests.push(new HttpRequest(urlStr, onComplete, onError));
    this.dequeue();
  }

  dequeue() {
    while (this.operations < 10 && this.requests.length > 0) {
      this.operations++;
      this.get(this.requests.shift(), () => {
        this.operations--;
        this.dequeue();
      });
    }
  }

  get(request, onComplete) {
    if (!Url.parse(request.urlStr).hostname) {
      request.onError('Invalid url `' + request.urlStr + '`.');
      onComplete();
      return;
    }

    let url = new URL(request.urlStr);
    let options = {
      auth: this.username + ":" + this.password
    };

    let protocol = null;
    switch (url.protocol) {
      case 'http:':
        protocol = Http;
        break;
      case 'https:':
        protocol = Https;
        break;
    }
    let startTime = performance.now();

    if(!protocol) {
      request.onError('Protocol not supported `' + url.protocol + '`');
      return;
    }

    let req = protocol.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        let endTime = performance.now();

        if (Math.floor(res.statusCode / 100) === 3 && res.headers.location) {
          let location = Url.resolve(url.href, res.headers.location);
          this.queue(location, request.onComplete, request.onError);
        } else {
          request.onComplete(new HttpResult(url.href, res.statusCode, Math.floor(endTime - startTime), data));
        }
        onComplete();
      });
    });

    req.on('socket', (socket) => {
      socket.setTimeout(10000);
      socket.on('timeout', () => {
        req.abort();
      });
    });

    req.on('error', (e) => {
      request.onError(e.code);
      onComplete();
    });

    req.end();
  }
}

class HttpRequest {
  constructor(urlStr, onComplete, onError) {
    this.urlStr = urlStr;
    this.onComplete = onComplete;
    this.onError = onError;
  }
}

class HttpResult {
  constructor(url, statusCode, milliseconds, body) {
    this.url = url;
    this.statusCode = statusCode;
    this.milliseconds = milliseconds;
    this.body = body;
  }
}

class SitemapCrawler {
  constructor(client, onComplete, onError) {
    this.client = client;
    this.onComplete = onComplete;
    this.onError = onError;
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
    this.results.forEach((result, i, arr) => {
      let regex = RegExp('<(?:link|img)[^<]*?(?:href|src)\s*=\s*[\'"]http:\/\/');
      if(result.body && regex.test(result.body)) {
        arr[i].statusCode = 666;
      }
    });

    this.onComplete(this.results, this.errors);
  }

  crawlSitemap(url) {
    this.incrementOperations();

    this.client.queue(url, (result) => {
      let statuscode = result.statusCode;
      ParseStr(result.body, (err, result) => {
        let sitemapIndex = SitemapIndex.fromData(result);
        let sitemap = Sitemap.fromData(result);

        if (sitemapIndex) {
          sitemapIndex.urls.map((sitemapUrl) => {
            this.crawlSitemap(sitemapUrl);
          });
        } else if (sitemap) {
          sitemap.documents.map((document) => {
            if (this.uniqueUrls.indexOf(document.url)  !== -1) {
              return;
            }

            this.uniqueUrls.push(document.url);
            this.incrementOperations();

            this.client.queue(document.url, (result) => {
              this.results.push(result);
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
              });
            });
          });
        } else {
          statuscode === 401
            ? this.errors.push(`You are unauthorized for this webpage: "${url}"`)
            : this.errors.push(`Invalid sitemap: '${url}'`);
        }

        this.decrementOperations();
      });
    }, (error) => {
      this.errors.push('Could not fetch sitemap `' + url + '`. Error: ' + error + '');
      this.decrementOperations();
    });
  };
}

class SitemapIndex {
  constructor(urls) {
    this.urls = urls
  }

  static fromData(data) {
    if (!data || !data.sitemapindex || !data.sitemapindex.sitemap) {
      return false;
    }

    let urls = data.sitemapindex.sitemap.map((sitemap) => {
      return sitemap.loc[0];
    });

    return new SitemapIndex(urls);
  }
}

class Sitemap {
  constructor(documents) {
    this.documents = documents;
  }

  static fromData(data) {
    if (!data || !data.urlset || !data.urlset.url) {
      return false;
    }

    let urls = data.urlset.url.map((url) => {
      let images = url['image:image']
        ? url['image:image'].map((image) => {
          return new Image(image['image:loc'][0]);
        })
        : [];
      return new Document(url.loc[0], images);
    });

    return new Sitemap(urls);
  }
}

class Document {
  constructor(url, images) {
    this.url = url;
    this.images = images;
  }
}

class Image {
  constructor(url) {
    this.url = url;
  }
}

Http.createServer((req, res) => {
  let data = Url.parse(req.url, true).query;
  let user = {
    username: data.user || '',
    password: data.pass || '',
  };

  res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Request-Method', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  // res.setHeader('Access-Control-Allow-Headers', '*');
  res.writeHead(200, {"Content-Type": "application/json"});

  let client = new HttpClient(user);
  let sitemapCrawler = new SitemapCrawler(client, (results, errors) => {
    results = results.map((result, i) => {
      return Object.assign({num: i + 1}, result);
    });
    res.write(JSON.stringify({ results: results, errors: errors }));
    res.end();
  });

  sitemapCrawler.crawlSitemap(data.url || 'none');
}).listen(8000);
