// CLIENT-SIDE.JS

var connection = null; //global connection

// CONNECT user to websocket server
function connect() {
	connection = new WebSocket('ws://localhost:3000/connect');
	console.log("Connected to chat server");
}

// SEND the msg to websocket server
function sendMsg() {
	var msg = {
		user: 1,
		channel: 1,
		parent: 0,
		content: $("textarea[name='content']")
	};

	connection.send(JSON.stringify(msg));
}

// do something when server sends message
if (connection) {
	connection.onmessage = (msg) => {
		console.log("Received new message");
		var msg = JSON.parse(msg.data);
		var currentUser = 1;
		var isMine = "post";

		if (msg["user"] == currentUser) {isMine = "mine post";} else {isMine = "post";} // is the MSG mine?

		($('#msgs')
		.append("<div class='msgDiv'><div class='" + isMine + "'><p><b>" + msg["fname"] + " " + msg["lname"] + ": </b>" + msg["content"] + "</p></div><span id='timestamp'>" + msg['timestamp'] + "</span></div>"));
	};
}

// display msgs to client
function displayMsgs(res) {
	var currentUser = 1;
	var isMine = "post";

	$.each(res, (i, msg) => {
		if (msg["author"] == currentUser) {isMine = "mine post";} else {isMine = "post";}

		($(msgs)
		.append("<div class='msgDiv'><div class='" + isMine + "'><p><b>" + msg["fname"] + " " + msg["lname"] + ": </b>" + msg["content"] + "</p></div><span id='timestamp'>" + msg['timestamp'] + "</span></div>"));
	});

	scroll();
}