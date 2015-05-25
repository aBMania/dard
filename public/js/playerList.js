var PlayerList = function(){
	this.players = [];
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
		return;

	console.log('Player added to PlayerList');

	this.players[player.getId()] = player;

	return player;
}

PlayerList.prototype.remove = function(playerId){
	if(!this.players[playerId])
		return;

	console.log('Player deleted from PlayerList');

	this.players[playerId].remove();
	
	delete this.players[playerId];
}

PlayerList.prototype.getPlayerById = function(playerId){
	if(!this.players[playerId])
		return null;

	return this.players[playerId];
}

PlayerList.prototype.debug = function(){
	for(var playerId in this.players)
		console.log(this.players[playerId].getPlayer());

}