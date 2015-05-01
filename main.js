/**
 * Created by Coutaz Thibault on 4/14/2015.
 */

//Var to know when the game start or when it stop
/*var GAME_START = false,
    GAME_OVER = false;*/

//the size of the game
const width = 800;
const height= 600;

//Phaser
var game = new Phaser.Game(width, height, Phaser.AUTO, 'WebGame'/*, { preload: preload, create: create, update: update }*/);


//List variables
var platforms,
    player,
    cursors,
    StairCase,
    life= 4,
    chest,
    lock,
    box,
    timer,minutes = 0,secondes = 0,
    inventaryKey,
    platformJump,
    BoxState= 0, //=1 possible to take - =2 take - =3 on the floor and can't move anymore
    Key=false;


//for an transparent backgrond
game.transparent = false;

//we declare an obeject for the state "load" and "main"

var gameState = {};
gameState.load=function() { };
gameState.main=function() { };

gameState.load.prototype = {

    preload: function() {
        //background load pic
     game.load.image('background', 'images/Background.jpg');
     game.load.image('floor', 'images/floor.png');

        //import platform pic
     game.load.image('Platform6C', 'images/Platform6C.png');
     game.load.image('Platform5C', 'images/Platform5C.png');
     game.load.image('Platform3C', 'images/Platform3C.png');
     game.load.image('Platform2C', 'images/Platform2C.png');
     game.load.image('Platform4C', 'images/Platform4C.png');
     game.load.image('Platform1C', 'images/Platform1C.png');

        //Import staircase pic
     game.load.image('stair1','images/Staircase1.png');
     game.load.image('stair2','images/Staircase2.png');
     game.load.image('stair3.1','images/Staircase3.1.png');
     game.load.image('stair3.2','images/Staircase3.2.png');
     game.load.image('stair3.3','images/Staircase3.3.png');
     game.load.image('stair3.4','images/Staircase3.4.png');

        //Import YellowLock,box,heart,YellowKey,pass,exit
     game.load.image('yellowlock','images/YellowLock.png');
     game.load.image('yellowkey','images/YellowKey.png');
     game.load.image('box','images/Box.png');
     game.load.image('life','images/life.png');
     game.load.image('pass','images/pass.png');
     game.load.image('exit','images/Exit.png');
     game.load.image('end','images/levelcompleted.png');
     game.load.image('gameover','images/GameOver.png');
     game.load.image('barrier','images/ladder.png');


        //Import Script
     game.load.spritesheet('player','images/sprites/player.png',46.5,70);
     game.load.spritesheet('monster','images/sprites/monster.png',50,22);
     game.load.spritesheet('chest','images/sprites/chest.png',43,34);

    },

    create: function(){
        game.state.start('main');

    }

};

gameState.main.prototype = {

    create:function(){

        //Timer
            //  Create our Timer
            timer = game.time.create(false);

            //  Set a TimerEvent to occur after 2 seconds
            timer.loop(1000, updateCounter, this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
            timer.start();

        //enable the physic
        game.physics.startSystem(Phaser.Physics.ARCADE);


        //create background in the canvas
        game.add.sprite(0,0, 'background');

        //  The platforms group
        platforms = game.add.group();

        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Floor.
        var floor = platforms.create(0,height-50, 'floor');

        //  This stops it from falling away when you jump on it
        floor.body.immovable = true;

        //the differents platforms
        var Platform5C = platforms.create(0,200, 'Platform5C');
        Platform5C.body.immovable = true;

        var Platform6C = platforms.create(180,360, 'Platform6C');
        Platform6C.body.immovable = true;

        var Platform4C = platforms.create(width-172,100, 'Platform4C');
        Platform4C.body.immovable = true;

        var platform3C = platforms.create(width-129,360, 'Platform3C');
        platform3C.body.immovable = true;

       /* var platform1C = platforms.create(width-258,100, 'Platform1C');
        platform1C.body.immovable = true;*/
        var wall = platforms.create(180,263,'barrier');
        wall.body.immovable = true;

        var platform1C = platforms.create(0,480, 'Platform3C');
        platform1C.body.immovable = true;


        //the staircase group
            StairCase = game.add.group();
            StairCase.enableBody=true;

        //the Differents StairCase
            var Staircase1 = StairCase.create(215,200,'stair1');
            Staircase1.body.immovable = true;

            var Staircase2 = StairCase.create(438,360,'stair2');
            Staircase2.body.immovable = true;

            var Staircase31 = StairCase.create(width-86,243,'stair3.1');
            Staircase31.body.immovable = true;

            var Staircase32 = StairCase.create(width-129,180,'stair3.2');
            Staircase32.body.immovable = true;

            var Staircase33 = StairCase.create(width-172,110,'stair3.3');
            Staircase33.body.immovable = true;

            var Staircase34 = StairCase.create(width-212,100,'stair3.4');
            Staircase34.body.immovable = true;

        //Exit
            exit=game.add.sprite(width-66,47,'exit');
            game.physics.arcade.enable(exit);

        //Life
            life1= game.add.sprite(0,0,'life');
            life2 =game.add.sprite(39,0,'life');
            life3 =game.add.sprite(78,0,'life');
            life4 =game.add.sprite(117,0,'life');

        //Yellow Lock.
            lock = game.add.sprite(0,430,'yellowlock');
            game.physics.arcade.enable(lock);

        //The Chest.
            chest = game.add.sprite(43,166,'chest');
            chest.animations.add('open', [1], 10, true);
            game.physics.arcade.enable(chest);

        //the player
            player = game.add.sprite(800,height-150,'player');

        //  We need to enable physics on the player
            game.physics.arcade.enable(player);

        //  Player physics properties. Give the little guy a slight bounce.
            player.body.bounce.y = 0.2;
            player.body.gravity.y = 987;
            player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
            player.animations.add('left', [0, 1, 2, 3], 10, true);
            player.animations.add('right', [5,6,7,8], 10, true);

        //The Ennemy.

            //Monster1
                monster1 = game.add.sprite((Math.random() * 780 )+ 20,(Math.random() * 100 )+ 20,'monster');
                game.physics.arcade.enable(monster1);
                monster1.animations.add('fly', [0,1], 10, true);
                monster1.body.collideWorldBounds = true;
                monster1.inputEnabled = true;
                monster1.input.enableDrag();

                monster1.events.onDragStart.add(startDrag1,this);
                monster1.events.onDragStop.add(stopDrag1,this);

        //Monster2
                monster2 = game.add.sprite((Math.random() * 780 )+ 20,(Math.random() * 100 )+ 20,'monster');
                game.physics.arcade.enable(monster2);
                monster2.animations.add('fly', [0,1], 10, true);
                monster2.body.collideWorldBounds = true;
                monster2.inputEnabled = true;
                monster2.input.enableDrag();

                monster2.events.onDragStart.add(startDrag2,this);
                monster2.events.onDragStop.add(stopDrag2,this);

        //Monster 3
            monster3 = game.add.sprite((Math.random() * 780 )+ 20,(Math.random() * 100 )+ 20,'monster');
            game.physics.arcade.enable(monster3);
            monster3.animations.add('fly', [0,1], 10, true);
            monster3.body.collideWorldBounds = true;
            monster3.inputEnabled = true;
            monster3.input.enableDrag();

            monster3.events.onDragStart.add(startDrag3,this);
            monster3.events.onDragStop.add(stopDrag3,this);

        //Monster 4
            monster4 = game.add.sprite((Math.random() * 780 )+ 20,(Math.random() * 100 )+ 20,'monster');
            game.physics.arcade.enable(monster4);
            monster4.animations.add('fly', [0,1], 10, true);
            monster4.body.collideWorldBounds = true;
            monster4.inputEnabled = true;
            monster4.input.enableDrag();

            monster4.events.onDragStart.add(startDrag4,this);
            monster4.events.onDragStop.add(stopDrag4,this);


        //  Our controls.
            cursors = game.input.keyboard.createCursorKeys();




    },

    update:function(){


        //Display the Timer.
        if(secondes <10){
            game.debug.text('Timer:' + minutes+':0'+ secondes, 32, 64);
        }else{
            game.debug.text('Timer:' + minutes+':'+ secondes, 32, 64);
        }


        //  Collider
        game.physics.arcade.collide(player, platforms);
        //game.physics.arcade.collide(monster, platforms);
        //game.physics.arcade.collide(player, box);
        game.physics.arcade.collide(box, platforms);
        game.physics.arcade.collide(player,platformJump);

        //check if he is collider with a Staircase
        game.physics.arcade.overlap(player, StairCase, climb, null, this);

        //check if he is collider with the chest
        game.physics.arcade.overlap(player, chest, open, null, this);

        //check if the player take the box.
        game.physics.arcade.overlap(player, box, takeit, null , this);

        //check if the player try to open the Lock.
        game.physics.arcade.overlap(player, lock, putKey, null , this);

        //Check if the player is hit from the monster.
        game.physics.arcade.overlap(player, monster1, hit1, null , this);
        game.physics.arcade.overlap(player, monster2, hit2, null , this);
        game.physics.arcade.overlap(player, monster3, hit3, null , this);
        game.physics.arcade.overlap(player, monster4, hit4, null , this);

        //check if the player finish the level.
        game.physics.arcade.overlap(player, exit, end, null , this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        monstermovement();

        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && BoxState== 2){
            BoxState=3;
            //box.body.gravity.y = 0;
            box.x = player.x +1;
            box.y = player.y + 26;
        }

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

            /*if(BoxState==2){
                box.x=player.x-40;
                box.y=player.y+20;
            }*/

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            /*if(BoxState==2){
                box.x=player.x+40;
                box.y=player.y+20;
            }*/

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

           /* if(BoxState==2){
                box.x=player.x;
                box.y=player.y+20;
            }*/

            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -350;
        }

    }

};

//Function for the Timer
function updateCounter() {

    secondes++;
    if(secondes==60){
        minutes++;
        secondes=0;
    }

}

//Function when the player want to use the Stair Case
function climb (player){

    if(cursors.up.isDown){
        player.body.velocity.y=-150
    }

}

//function open the chest
function open(){
    if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
        chest.frame = 1;
        //Box.
        box = game.add.sprite(100,155,'box');
        game.physics.arcade.enable(box);
        box.body.gravity.y = 970;
        //box.body.collideWorldBounds = true;
        //box.body.immovable=true;
        boxState=1;
        Key=true;
        inventaryKey = game.add.sprite(0,548,'yellowkey');

        chest.kill();
    }

}

//functon takeit , when the player take the box.
function takeit(){
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        BoxState=2;
    }
}

//Fucntion to open the Lock.
function putKey(){
    if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
        Key=false;
        inventaryKey.kill();
        platformJump = game.add.sprite(550,375,'pass');
        game.physics.arcade.enable(platformJump );
        platformJump.body.immovable=true;
    }
}

//Function for the movement of the Monsters
function monstermovement(){

    monster1.animations.play('fly');
    monster2.animations.play('fly');
    monster3.animations.play('fly');
    monster4.animations.play('fly');


    //Monster 1
    if(player.x >monster1.x){
        monster1.x = monster1.x+1;
    }else{
        monster1.x = monster1.x-1;
    }

    if(player.y >monster1.y){
        monster1.y = monster1.y+1;
    }else{
        monster1.y = monster1.y-1;
    }

    //Monster 2
    if(player.x >monster2.x){
        monster2.x = monster2.x+1;
    }else{
        monster2.x = monster2.x-1;
    }

    if(player.y >monster2.y){
        monster2.y = monster2.y+1;
    }else{
        monster2.y = monster2.y-1;
    }

    //Monster 3
    if(player.x >monster3.x){
        monster3.x = monster3.x+1;
    }else{
        monster3.x = monster3.x-1;
    }

    if(player.y >monster3.y){
        monster3.y = monster3.y+1;
    }else{
        monster3.y = monster3.y-1;
    }

    //Monster 4
    if(player.x >monster4.x){
        monster4.x = monster4.x+1;
    }else{
        monster4.x = monster4.x-1;
    }

    if(player.y >monster4.y){
        monster4.y = monster4.y+1;
    }else{
        monster4.y = monster4.y-1;
    }

}

//Function when the player hit by a monster1 and loose on life.
function hit1(){

    if(life==4){
        life--;
        life4.kill();
        monster1.kill();
    }else if(life==3){
        life--;
        life3.kill();
        monster1.kill();
    }else  if(life==2){
        life--;
        life2.kill();
        monster1.kill();
    }else if(life==1){
        life--;
        life1.kill();
        monster1.kill();
        timer.stop();
        game.add.sprite(0,0,'gameover');
    }
}

//Function when the player hit by a monster2 and loose on life.
function hit2(){

    if(life==4){
        life--;
        life4.kill();
        monster2.kill();
    }else if(life==3){
        life--;
        life3.kill();
        monster2.kill();
    }else  if(life==2){
        life--;
        life2.kill();
        monster2.kill();
    }else if(life==1){
        life--;
        life1.kill();
        monster2.kill();
        timer.stop();
        game.add.sprite(0,0,'gameover');
    }
}

//Function when the player hit by a monster3 and loose on life.
function hit3(){

    if(life==4){
        life--;
        life4.kill();
        monster3.kill();
    }else if(life==3){
        life--;
        life3.kill();
        monster3.kill();
    }else  if(life==2){
        life--;
        life2.kill();
        monster3.kill();
    }else if(life==1){
        life--;
        life1.kill();
        monster3.kill();
        timer.stop();
        game.add.sprite(0,0,'gameover');
    }
}

//Function when the player hit by a monster4 and loose on life.
function hit4(){

    if(life==4){
        life--;
        life4.kill();
        monster4.kill();
    }else if(life==3){
        life--;
        life3.kill();
        monster4.kill();
    }else  if(life==2){
        life--;
        life2.kill();
        monster4.kill();
    }else if(life==1){
        life--;
        life1.kill();
        monster4.kill();
        timer.stop();
        game.add.sprite(0,0,'gameover');
    }
}


//Function for the Drag for monster1
function startDrag1(){
    monster1.body.moves=false;
}

function stopDrag1(){
    monster1.body.moves=true;
}

//Function for the Drag for monster2
function startDrag2(){
    monster2.body.moves=false;
}

function stopDrag2(){
    monster2.body.moves=true;
}

//Function for the Drag for monster3
function startDrag3(){
    monster3.body.moves=false;
}

function stopDrag3(){
    monster3.body.moves=true;
}

//Function for the Drag for monster3
function startDrag4(){
    monster4.body.moves=false;
}

function stopDrag4(){
    monster4.body.moves=true;
}


//End function.
function end(){
    game.add.sprite(150,50,'end');
}

//we add the two functions to our object
game.state.add('load', gameState.load);
game.state.add('main', gameState.main);

//then start "load"
game.state.start('load');

