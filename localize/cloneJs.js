const fs = require("fs");
const path = require('path');
const mkdirp = require('mkdirp');
const fetch = require("node-fetch");

const extensionRoot = 'https://extensions.turbowarp.org/';
let extensions = JSON.parse(fs.readFileSync('local/extensions/extensions-v0.json')).extensions;
extensions = extensions.map(ext => {
    let match = /^(.*?)\/?([^\/]+)$/.exec(ext.slug);
    return {
        dir: match[1],
        file: match[2] + ".js",
        url: extensionRoot + ext.slug + ".js"
        // url: ext.slug + ".js"
    };
});

function downloadExtension(extensions) {
    extensions.forEach(async (ext) => {
        let extDir = path.join("local/extensions", ext.dir);
        if (!fs.existsSync(extDir))
            mkdirp.sync(extDir);

        // console.log(`${extDir}/${ext.file}`);
        let resp = await fetch(ext.url);
        resp.body.pipe(fs.createWriteStream(path.join(extDir, ext.file)));
    });
}

downloadExtension(extensions);
