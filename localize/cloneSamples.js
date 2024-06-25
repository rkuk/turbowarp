const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const fetch = require('node-fetch');

let samples = fs.readFileSync('local/extensions/index.html', {encoding: 'utf-8'});
samples = samples.match(/(?<==)https:\/\/.+sb3/g);
samples = samples.map(s => {
    s = unescape(s);
    return {
        file: /[^\/]+$/.exec(s)[0],
        url: s
    };
});

function downloadSample (samples) {
    const sampleDir = 'local/extensions/samples';
    mkdirp.sync(sampleDir);
    samples.forEach(async s => {
        const resp = await fetch(s.url);
        resp.body.pipe(fs.createWriteStream(path.join(sampleDir, s.file)));
    });
}

downloadSample(samples);
