var Player = function(data){

	this.me = data.me;
	this.id = data.id;

	this.sprite = game.add.sprite(0, 0,'pacman');
	this.sprite.exists = false;
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	
	game.add.sprite(this.sprite);

	if(this.me)
	{
		console.log('c\'est moi, j\'utilise p2')
		game.physics.p2.enable(this.sprite);
		this.sprite.body.fixedRotation = true;
	}
	else
	{
		console.log('c\'est pas moi : ' + this.me)
		game.physics.arcade.enable(this.sprite);
		this.sprite.body.immovable = true;
	}	


	this.setUsername(data.username);
	this.setTeam(data.team);


	this.position = {
		x: 0,
		y: 0
	}
	this.angle = 0;

	this.debugrepresentation = $('<div>').attr('id', this.id)
							.append('<div class="username">'+this.username+'</div>')
							.append('<div class="position">?</position>')
							.append('<div class="angle">?</position>');

	$('#players').append(this.debugrepresentation);

	console.log('Player created : ' + this.username);
}

Player.prototype.getPlayer = function(){
	return {
		id: 		this.id,
		username: 	this.username,
		team: 		this.team
	};
}

Player.prototype.getId = function(){
	return this.id;
}

Player.prototype.getTeam = function(){
	return this.team;
}

Player.prototype.show = function(){
	this.sprite.exists = true;
}

Player.prototype.hide = function(){
	this.sprite.exists = false;
}

Player.prototype.setTeam = function(team){
	if(team)
		this.show();
	else
		this.hide();

	this.team = team;
}

Player.prototype.getUsername = function(){
	return this.username;
}

Player.prototype.setUsername = function(username){
	this.username = username;
}

Player.prototype.setAngle = function(angle){
	this.angle = angle;
	$("#" + this.id).find(".angle").html('angle :' + this.angle);
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
	this.position = position
	
	$("#" + this.id).find(".position").html('x:' + this.position.x + ', y:' + this.position.y);
}

Player.prototype.update = function(update){
	if(!update.hasOwnProperty('position')
		|| !update.hasOwnProperty('angle')
		|| !update.hasOwnProperty('time'))
	{
		console.log('Données de mise à jour érronées : ', update);
		return;
	}
	this.setPosition(update.position);
	this.setAngle(update.angle);		
	this.setTime(update.time);
}

Player.prototype.getId = function(){
	return this.id;
}

Player.prototype.remove = function(){
	this.sprite.destroy();
}

Player.prototype.spawn = function(){
	this.sprite.exists = true;	
}