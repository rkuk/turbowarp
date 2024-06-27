import {
    createClient
} from "webdav";
import {
    existsSync,
    createReadStream
} from "fs";
import {
    basename
} from "path";

function push(filePath) {
    const fileName = basename(filePath);
    const client = createClient(process.env.DAV_URL, {
        username: process.env.DAV_USER,
        password: process.env.DAV_PASS
    });
    let uploadStream = client.createWriteStream(`/SSD/${fileName}`);
    createReadStream(filePath).pipe(uploadStream);
}

const filePath = process.argv[2];
if(filePath && existsSync(filePath))
    push(filePath);
