'use strict';

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = _http2.default.createServer(handler); /**
                                                 * Created by zppro on 16-9-26.
                                                 */


var io = (0, _socket2.default)(app);

function handler(req, res) {
    "use strict";

    _fs2.default.readFile(__dirname + '/../client/index.html', function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end(err.message);
        }
        res.writeHead(200);
        res.end(data);
    });
};

io.on('connection', function (socket) {
    console.log('a user connected');
});

app.listen(3003);