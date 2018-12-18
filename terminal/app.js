// Import classes
const HttpClient = require('./src/HttpClient'),
  SitemapCrawler = require('./src/SitemapCrawler'),

// Import modules
  Url = require('url'),
  Http = require('http'),
  Args = require('minimist')(process.argv.slice(2)),
  Env = require('dotenv').config({ path: './.env' }).parsed;

help = () => {
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
};

cmd = () => {
  console.log(`Getting data from: ${Args.U || Args.url}...`);
  let user = {
    username: Args.u || Args.username || '',
    password: Args.p || Args.password || '',
  };

  let client = new HttpClient(user);
  let sitemapCrawler = new SitemapCrawler(client, (results, errors) => {
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

api = () => {
  Http.createServer((req, res) => {
    let data = Url.parse(req.url, true).query;
    let user = {
      username: data.user || '',
      password: data.pass || '',
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { "Content-Type": "application/json" });

    let client = new HttpClient(user);
    let sitemapCrawler = new SitemapCrawler(client, (results, errors) => {
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

console.log(Args);
console.log(Object.keys(Args).length);
console.log();

if (Args.h || Args.help)
  help();
else if (Args.U || Args.url)
  cmd();
else if (Args.r || Args.run)
  api();
else
  console.log(`Use the help flags to find more commands! [-h | --help]`);
