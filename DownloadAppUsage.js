const getScript = (url) => {
    return new Promise((resolve, reject) => {
        const crypto = require('crypto');
        const http = require('http'),
            https = require('https');

        let client = http;

        if (url.toString().indexOf("https") === 0) {
            client = https;
        }
        const options = {
            rejectUnauthorized: false,
            secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
        };

        client.get(url, options, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(data);
            });

        }).on("error", (err) => {
            reject(err);
        });
    });
};


getScript("https://banglejs.com/apps/appusage.json")
    .then(script => {
        const appUsage = JSON.parse(script);

        appUsage.app = Object.keys(appUsage.app).sort().reduce(
            (obj, key) => {
                obj[key] = appUsage.app[key];
                return obj;
            },
            {}
        );

        appUsage.fav = Object.keys(appUsage.fav).sort().reduce(
            (obj, key) => {
                obj[key] = appUsage.fav[key];
                return obj;
            },
            {}
        );

        return new Promise(resolve => resolve(appUsage));
    })
    .then(data => {
        const fs = require('fs');

        fs.writeFile('appUsage.json', JSON.stringify(data, null, 4), err => {
            if (err) {
                console.error(err);
            }
        });
    });
