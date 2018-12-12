const Url = require('url'),
  ParseStr = require('xml2js').parseString,
  Http = require('http'),
  Https = require('https'),
  {performance} = require('perf_hooks'),
  Args = require('minimist')(process.argv.slice(2)),
  Env = require('dotenv').config({path: './.env'}).parsed;

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

    if (!protocol) {
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
    this.mixedContent = null;
  }

  isSuccess() {
    return Math.floor(this.statusCode / 100) == 2;
  };

  checkMixedContent() {
    let regex = RegExp('<(?:link|img)[^<]*?(?:href|src)\s*=\s*[\'"]http:\/\/');
    if (this.body) {
      if (regex.test(this.body)) {
        this.mixedContent = true;
      } else {
        this.mixedContent = false;
      }
    } else {
      this.mixedContent = null;
    }
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

if (Args.h || Args.help) {
  console.log();
  console.log(`Valid flags: `);
  console.log(`node app.js [-h | --help] [--url] [-u | --username] [-p | --password] [-r | --run]`);
  console.log(`\r\n\r\nCommands:\r\n${`-`.repeat(50)}\r\n`);
  console.log(`  -h \t| --help \t Help menu`);
  console.log(`  \t  --url \t Url of Sitemap`);
  console.log(`  -u \t| --username \t Username for authorization need [--url]`);
  console.log(`  -p \t| --password \t Password for authorization need [--url]`);
  console.log(`  -r \t| --run \t Run API for the front-end default port: ${Env.PORT}`);
  console.log(`  -P \t| --port \t Run API on specific port`);
  console.log(`  -s \t| --strip \t Strips all succesfull results`);
} else if (Args.url) {
  console.log(`Getting data from: ${Args.url}...`);
  let user = {
    username: (Args.u || '') || (Args.username || ''),
    password: (Args.p || '') || (Args.password || ''),
  };

  let client = new HttpClient(user);
  let sitemapCrawler = new SitemapCrawler(client, (results, errors) => {
    if (results.length > 0) {
      console.log()
      console.log(`\x1b[32m%s\x1b[0m`, `Results:`)
      results.map((result) => {
        if (Args.s || Args.strip) {
          result.isSuccess() || console.log(`\x1b[31m%s\x1b[0m`, `${result.statusCode} | ${result.url}`)
        } else {
          let color = result.isSuccess()
            ? `\x1b[32m%s\x1b[0m` // green
            : `\x1b[31m%s\x1b[0m`; // red
          console.log(`${color}`, `${result.statusCode} | ${result.url}`);
        }
      });

      let successCount = results.filter((result) => {
        return result.isSuccess()
      }).length;
      let errorCount = results.filter((result) => {
        return !result.isSuccess()
      }).length;
      let mixedContentCount = results.filter((result) => {
        return result.mixedContent
      }).length;

      console.log();
      console.log(`Success: ${successCount}`);
      console.log(`Error: ${errorCount}`);
      console.log(`MixedContent: ${mixedContentCount}`);

      if (errorCount > 0) {
        console.error('\x1b[31m%s\x1b[0m', 'Sitemap has errors! Pls fix :c');
        process.exit(1);
      } else {
        process.exit(0);
      }
    }
    if (errors.length > 0) {
      console.log(``)
      console.log(`\x1b[31m%s\x1b[0m`, `Errors:`)
      errors.map((error, i) => {
        console.log(i, error);
      });
    }
  });

  sitemapCrawler.crawlSitemap(Args.url || 'none');
} else if (Args.r) {
  Http.createServer((req, res) => {
    let data = Url.parse(req.url, true).query;
    let user = {
      username: (Args.u || '') || (Args.username || ''),
      password: (Args.p || '') || (Args.password || ''),
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
      res.write(JSON.stringify({results: results, errors: errors}));
      res.end();
    });

    sitemapCrawler.crawlSitemap(data.url || 'none');
  }).listen(Args.P || Args.port || Env.PORT, () => {
    console.log(`Running API on port ${Args.P || Args.port || Env.PORT}...`)
  });
} else {
  console.log(`Use the help flags to find more commands! [-h | --help]`)
}
