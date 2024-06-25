const fs = require("fs");

const sounds = JSON.parse(fs.readFileSync('src/lib/libraries/sounds.json'));
const costumes = JSON.parse(fs.readFileSync('src/lib/libraries/costumes.json'));
const backdrops = JSON.parse(fs.readFileSync('src/lib/libraries/backdrops.json'));
const sprites = JSON.parse(fs.readFileSync('src/lib/libraries/sprites.json'));

let imgAssets = costumes.concat(backdrops);
let sndAssets = sounds;
sprites.forEach(sp => {
    imgAssets.concat(sp.costumes);
    sndAssets.concat(sp.sounds);
});

// `https://cdn.assets.scratch.mit.edu/internalapi/asset/${iconMd5}/get/` :
const imgUrlRoot = 'https://cdn.assets.scratch.mit.edu/internalapi/asset';
// return `${this.assetHost}/internalapi/asset/${asset.assetId}.${asset.dataFormat}/get/`;
const sndUrlRoot = 'https://assets.scratch.mit.edu/internalapi/asset';

imgAssets = Array.from(new Set(imgAssets.map(a => a.md5ext)));
sndAssets = Array.from(new Set(sndAssets.map(a => a.md5ext)));

const fetch = require("node-fetch");
const path = require('path');
const mkdirp = require('mkdirp');
let assetsDir = mkdirp.sync("local/assets");

function downloadAssets(rootUrl, assets) {
    assets.forEach(async (a) => {
        let resp = await fetch(`${rootUrl}/${a}/get/`);
        resp.body.pipe(fs.createWriteStream(path.join(assetsDir, a)));
    });
}

downloadAssets(imgUrlRoot, imgAssets);
downloadAssets(sndUrlRoot, sndAssets);
