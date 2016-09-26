/**
 * Created by zppro on 16-9-26.
 */
import $io from 'socket.io';
import http from 'http';
import fs from 'fs';
import path from 'path';


const mime = {

    "css": "text/css",

    "gif": "image/gif",

    "html": "text/html",

    "ico": "image/x-icon",

    "jpeg": "image/jpeg",

    "jpg": "image/jpeg",

    "js": "text/javascript",

    "json": "application/json",

    "pdf": "application/pdf",

    "png": "image/png",

    "svg": "image/svg+xml",

    "swf": "application/x-shockwave-flash",

    "tiff": "image/tiff",

    "txt": "text/plain",

    "wav": "audio/x-wav",

    "wma": "audio/x-ms-wma",

    "wmv": "video/x-ms-wmv",

    "xml": "text/xml"

};


let app = http.createServer(handler);

let io = $io(app);


function handler(req,res) {
    "use strict";

    var url = req.url;
    var site_root = __dirname + '/../client';

    if(url != '/'){
        var ext = path.extname(url);

        ext = ext ? ext.slice(1) : 'unknown';

        var contentType = mime[ext] || "text/plain";

        fs.readFile(site_root + url,
            (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end(err.message);
                }
                console.log(url);
                res.writeHead(200, {'Content-Type': contentType});
                res.end(data);
            });

        // response.writeHead(200, {'Content-Type': contentType});
        // response.write(file, "binary");
        // response.end();
    }
    else{
        fs.readFile(site_root + '/index.html',
            (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end(err.message);
                }
                console.log(req.url);
                res.writeHead(200);
                res.end(data);
            });
    }


};


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', (data) => {
        console.log(data);
    });

    socket.on('disconnect', ()=> {
        console.log('user disconnected');
    });
});

app.listen(3003);