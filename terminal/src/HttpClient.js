const HttpRequest = require('./HttpRequest'),
  HttpResult = require('./HttpResult');

const Url = require('url'),
  Http = require('http'),
  Https = require('https'),
  { performance } = require('perf_hooks');

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
      auth: this.username + ":" + this.password,
      headers: {
        'User-Agent': 'Geen robot *bliepbloop*'
      }
    };

    let protocol = null;
    switch (url.protocol) {
      case 'http:':
        protocol = Http;
        break;
      case 'https:':
        protocol = Https;
        break;
      default:
        throw error;
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

module.exports = HttpClient;
