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

    let url = req.url;
    let project_root = __dirname+'/../..';
    let site_root = __dirname + '/../client';
    
    if(url != '/'){
        let ext = path.extname(url);
        ext = ext ? ext.slice(1) : 'unknown';

        let contentType = mime[ext] || "text/plain";
        let resource_path = project_root+url;
        fs.readFile(resource_path,
            (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end(err.message);
                }
                res.writeHead(200, {'Content-Type': contentType});
                res.end(data);
            });
    }
    else{
        fs.readFile(site_root + '/index.html',
            (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end(err.message);
                }
                res.writeHead(200);
                res.end(data);
            });
    }


};


io.on('connection', (socket) => {
    console.log('a user connected:'+socket.id);
    socket.broadcast.emit('chat.message','hi '+socket.id);

    socket.on('chat.message', (msg) => {
        console.log('message: ' + msg);
        if (/^#[0-9]+$/ig.test(msg)) {
            //create room command
            let room = 'room#' + msg.substr(1);
            if (room) {

                if (io.sockets.adapter.sids[socket.id][room]) {
                    console.log('already in room');
                }
                else {
                    console.log('enter room');
                    socket.join(room);
                    //socket.to(room).emit('chat.message', socket.id + ' enter ' + room);//to()方法用于在指定的房间中，对除了当前socket的其他socket发送消息。
                    io.sockets.in(room).emit('chat.message', socket.id + ' enter ' + room);//in()方法用于在指定的房间中，为房间中的所有有socket发送消息。
                }
            }
        }
        else if (/^\$([0-9]+):([^:]+)$/ig.test(msg)) {
            //网指定房间发送消息
            console.log('网指定房间发送消息: ' + msg);
            let groups =  /^\$([0-9])+:([^:]+)$/ig.exec(msg);
            let room = 'room#'+groups[1];

            if (io.sockets.adapter.sids[socket.id][room]) {

                let content = groups[2];
                console.log(' in room and send:'+content);
                io.sockets.in(room).emit('chat.message', content);//in()方法用于在指定的房间中，为房间中的所有有socket发送消息。
            }

        }
        else {
            //向所有客户端广播
            io.emit('chat.message', msg);
        }
    });

    socket.on('disconnect', ()=> {
        console.log('user disconnected');
    });
});

app.listen(3003);