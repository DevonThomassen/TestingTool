import { HttpResult } from "./HttpResult";
import { ServerResponse, IncomingMessage } from "http";

// Import classes
const HttpClient = require('./HttpClient'),
  SitemapCrawler = require('./SitemapCrawler'),
  User = require('./User'),

  // Import modules
  Url = require('url'),
  Http = require('http'),
  Args = require('minimist')(process.argv.slice(2)),
  Env = require('dotenv').config({ path: './.env' }).parsed;

console.log(Args);

function help(): void {
  console.log(`Valid flags: ` +
    `node app.js [-h | --help] [-U | --url] [-u | --username] [-p | --password] [-r | --run]\r\n\r\n` +
    `Commands:\r\n${`-`.repeat(75)}\r\n` +
    `  -h \t| --help \t Help menu \r\n` +
    `  -U \t| --url \t Url of Sitemap\r\n` +
    `  -p \t| --password \t Password for authorization needs flag [-U | --url]\r\n` +
    `  -u \t| --username \t Username for authorization needs flag [-U | --url]\r\n` +
    `  -s \t| --strip \t Strips all succesfull results needs flag [-U | --url] \r\n` +
    `  -r \t| --run \t Run API for the front-end default port: ${Env.PORT}\r\n` +
    `  -P \t| --port \t Run API on specific port needs flag [-r | --run]`
  );
}

function cmd(): void {
  console.log(`Getting data from: ${Args.U || Args.url}...`);
  let user = new User(Args.u || Args.username || '', Args.p || Args.password || '');

  let client = new HttpClient(user);

  let sitemapCrawler = new SitemapCrawler(client, (results: HttpResult[], errors: string[]) => {
    if (results.length > 0) {
      console.log(`\r\n\x1b[36;1m%s\x1b[0m`, `Results:`);
      results.map((result) => {
        if (Args.s || Args.strip) {
          result.isSuccess() || console.log(`\x1b[31m%s\x1b[0m`, `${result.statusCode} | ${result.url}`);
        } else {
          let color = result.isSuccess()
            ? `32;1` // green
            : `31;1`; // red
          if (result.mixedContent)
            color = `33;1`; // yellow
          console.log(`\x1b[${color}m%s\x1b[0m`, `${result.statusCode} | ${result.url}`);
        }
      });

      let successCount = results.filter((result) => {
        return result.isSuccess();
      }).length;
      let errorCount = results.filter((result) => {
        return !result.isSuccess();
      }).length;
      let mixedContentCount = results.filter((result) => {
        return result.mixedContent;
      }).length;

      console.log();
      console.log(`\x1b[32;1m%s\x1b[0m`, `Success: ${successCount}`);
      console.log(`\x1b[31;1m%s\x1b[0m`, `Error: ${errorCount}`);
      console.log(`\x1b[33;1m%s\x1b[0m`, `MixedContent: ${mixedContentCount}`);

      if (errorCount > 0) {
        console.error('\x1b[31m%s\x1b[0m', 'Sitemap has errors! Pls fix :c');
        process.exit(1);
      } else {
        process.exit(0);
      }
    }
    if (errors.length > 0) {
      console.log(`\r\n\x1b[31;1m%s\x1b[0m`, `Errors:`);
      errors.map((error, i) => {
        console.log(i, error);
      });
    }
  });
  sitemapCrawler.crawlSitemap(Args.U || Args.url || 'none');
}

function api(): void {
  Http.createServer((req: IncomingMessage, res: ServerResponse) => {
    let data = Url.parse(req.url , true).query;
    let user = new User(data.user || '', data.pass || '',);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { "Content-Type": "application/json" });

    let client = new HttpClient(user);
    let sitemapCrawler = new SitemapCrawler(client, (results: HttpResult[], errors: String[]) => {
      results = results.map((result, i) => {
        return Object.assign({ num: i + 1 }, result);
      });
      res.write(JSON.stringify({
        results: results,
        errors: errors
      }));
      res.end();
    });

    sitemapCrawler.crawlSitemap(data.url || 'none');
  }).listen(Args.P || Args.port || Env.PORT, () => {
    console.log(`Running API on port ${Args.P || Args.port || Env.PORT}...`);
  });
};

if (Args.h || Args.help)
  help();
else if (Args.U || Args.url)
  cmd();
else if (Args.r || Args.run)
  api();
else
  console.log(`Use the help flags to find more commands! [-h | --help]`);