module.exports = GameState = function(user){
	
	// Players array
	this.players = {}; // [id => pseudo]

	// Shots array
	this.shots = [];
	this.shotId = 0;
}

GameState.prototype.getGameState = function(){
	return {
		players: this.players,
		shots: this.shots
	};
};

GameState.prototype.addPlayer = function(id, pseudo){
	this.players[id] = {};
	this.players[id].pseudo = pseudo;
}

GameState.prototype.removePlayer = function(id){
	delete this.players[id]
}

GameState.prototype.playerMove = function(id, data){
	player = this.players[id]
	
	if(!player){
		console.error('un joueur inconnu bouge, étrange...');
		return;
	}

	player.position = data;
}

GameState.prototype.die = function(deadId, killerId){
	dead = this.players[deadId]
	killer = this.players[killerId]
	
	if(!dead){
		console.error('un joueur inconnu meurt, étrange...');
		return;
	}

	if(!killer){
		console.error('un joueur inconnu tue, étrange...');
		return;
	}

	dead.rampage = 0
	killer.rampage += 1;
}

GameState.prototype.addShot = function(id, shot){

	player = this.players[id]
	
	if(!player){
		console.error('un joueur inconnu bouge, étrange...');
		return;
	}

	this.shots.push({ id: this.shotId, playerId: id, data: shot });
	var id = this.shotId;

	this.shotId++;
	
	var self = this;

	setTimeout(function(){
		for(i in self.shots){
			if(self.shots[i].id == id)
				self.shots.splice(i, 1);
		}
	}, 10000); 
}