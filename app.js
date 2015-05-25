var express     = require('express');
var app         = express();
var dbConfig    = require('./config/db');
var GameState   = require('./models/gameState');
var _           = require('underscore')

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/client', function(req, res) {
    res.sendFile(__dirname + '/html/client.html');
});

var server    = require("http").createServer(app);
var io        = require('socket.io')(server);

server.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'))
}) 

var gameState = new GameState();

io.on('connection', function(socket){

    console.log('connection');

    var logged_in = false;

    socket.on('login', function(pseudo){
        logged_in = true;
        socket.pseudo = pseudo;
        gameState.addPlayer(socket.id, pseudo);

        console.log(pseudo + " logged in (ID: " + socket.id + ")")
    });

    socket.on('leave', function(){

        if(!logged_in){
            console.log('Anonymous try to logout');
            return;
        }
        
        console.log(socket.pseudo + " left")

        gameState.removePlayer(socket.id);
        logged_in = false;

    });

    socket.on('move', function(data){

        if(!logged_in){
            console.log('Anonymous moving attempt');
            return;
        }

        if(isNaN(data.x) || isNaN(data.y)){
            console.log('Missing data for moving');
            return;
        }

        //console.log(socket.pseudo + " moved")

        gameState.playerMove(socket.id, data);

    });

    socket.on('fire', function(data){

        if(!logged_in){
            console.log('Anonymous firing attempt');
            return;
        }

        //console.log(socket.pseudo + " shotted")

        gameState.addShot(socket.id, data);
    });

    socket.on('player-die', function(id){

        if(!logged_in){
            console.log('Anonymous dying attempt');
            return;
        }

        //console.log(socket.pseudo + " died")

        gameState.die(socker.id, id)
    });

    socket.on('disconnect', function(){
        gameState.removePlayer(socket.id);
        logged_in = false;
        console.log('disconnection');
    });
});

// Main loop :
var ii = 0
function mainLoop (){
    gs = gameState.getGameState()
    /*
    ii = ii%100
    if(ii == 0)
        console.log(gs)
    ii++
*/
    for(socket in io.sockets.connected)
    {
        var players_without_self = _.omit(gs.players, socket)
        var shots_without_self = _.clone(gs.shots)

        i = 0
        while(i < shots_without_self.length)
            if(shots_without_self[i].playerId == socket)
                shots_without_self.splice(i, 1);
            else 
                i++

        gs_without_self = {
            players: players_without_self,
            shots: shots_without_self
        }

        io.sockets.connected[socket].emit('game-state', gs_without_self);
    }
    
}

setInterval(mainLoop, 10);