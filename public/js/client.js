var Client = function(io){
	this.io = io;
	this.socket = io.connect();
	this.socket.Client = this;
	this.gameState = null
	this.log = ["Welcome to DARD Multiplayer Mode"]

	self = this
	this.socket.on('game-state', function(data){
		self.gameState = data;
	});
	this.socket.on('log', function(data){
		self.log.push(data)
	});
};

Client.prototype.login = function(pseudo){
	this.socket.emit('login', pseudo);
}

Client.prototype.leave = function(){
	this.socket.emit('leave');
}

Client.prototype.move = function(data){
	this.socket.emit('move', data);
}

Client.prototype.fire = function(data){
	this.socket.emit('fire', data);
}

Client.prototype.die = function(id){
	this.socket.emit('player-die', id);
}