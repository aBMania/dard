var Player = require('./player');

module.exports = PlayerList = function(){
	this.players = [];
}

PlayerList.prototype.toData = function(){
	var data = {};

	for(var playerId in this.players){
 		data[playerId] = this.players[playerId].getPlayer();
 	}

 	return data;
}

PlayerList.prototype.forEach = function(callback){
	for(var player in this.players){
		callback(this.players[player]);
	}

}

PlayerList.prototype.getAll = function(){
	return this.players;
}


PlayerList.prototype.add = function(player){
	if(typeof player != 'object')
	{
		console.error('wrong');
		return;
	}

	this.players[player.getId()] = player;
}

PlayerList.prototype.remove = function(playerId){
	if(!this.players[playerId]){
		console.log('Try to remove a non existing player');
		return;
	}

	delete this.players[playerId];
}

PlayerList.prototype.getPlayerById = function(playerId){
	if(!this.players[playerId]){
		console.log('Try to get a non existing player');
		return null;
	}

	return this.players[playerId];
}

PlayerList.prototype.debug = function(){
	for(var playerId in this.players)
		console.log(this.players[playerId].getPlayer());

}