module.exports = Player = function(user){
	this.username = user.username;
	this.id = user.id;
	this.team = null;
	this.client = user.client;
}

Player.prototype.getPlayer = function(){
	
	// Send everything exept client
	return {
		id: 		this.id,
		username: 	this.username,
		team: 		this.team
	};
}

Player.prototype.getClient = function(){
	return this.client;
}

Player.prototype.getId = function(){
	return this.id;
}

Player.prototype.getTeam = function(){
	return this.team;
}

Player.prototype.setTeam = function(team){
	console.log('team updated');
	this.team = team;
}

Player.prototype.setAngle = function(angle){
	this.angle = angle;
}

Player.prototype.getAngle = function(angle){
	return this.angle;
}


Player.prototype.setTime = function(time){
	this.time = time;
}

Player.prototype.getTime = function(time){
	return this.time;
}


Player.prototype.getPosition = function(position){
	return this.position;
}

Player.prototype.setPosition = function(position){
	this.position = position;
}

Player.prototype.update = function(data){
	// Have to check more here

	if(!data.time || isNaN(data.angle)
					|| !data.position 
					|| !data.position.x 
					|| !data.position.y){
		console.log('position data incorrect');
		return false;
	}
	this.setAngle(data.angle);
	this.setTime(data.time);
	this.setPosition(data.position);

	return true;
}

Player.prototype.getId = function(){
	return this.id;
}

