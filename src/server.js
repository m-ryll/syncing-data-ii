var app = require("http").createServer(handler);
var io = require("socket.io")(app);
var fs = require("fs");
var PORT = process.env.PORT || process.env.NODE_PORT || 3000;
app.listen(PORT);
var draws = {};

function handler(req, res) {
	fs.readFile(__dirname + "/../client/index.html", function(err, data) {
		if (err) {
			throw err;
		}
		res.writeHead(200);
		res.end(data);
	});
}

io.on("connection", function(socket) {
	socket.on("join", function(data) {
		socket.join("room1");
		draws[data.name] = data.coords;
	});

	socket.on("draw", function(data) {
		draws[data.name] = data.coords;
		io.sockets.in("room1").emit("handleMessage", {name: data.name, coords: data.coords});
	});
});

console.log("listening on port " + PORT);