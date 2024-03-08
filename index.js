import * as setup from "./setup.js";
import * as monst from "./monster.js";
import { moveMonster } from "./monster.js";

var {
    canvas, ctx,
    bgReady, bgImage,
    edgReady, edgImage, edg2Ready, edg2Image,
    heroReady, heroImage,
    monsterReady, monsterImage,
    targetReady, targetImage
} = setup;

var {
    monster
} = monst;

var stopgame = false; //used to stop the game (for gameover).

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    //  Request to do this again ASAP
    if(!stopgame){requestAnimationFrame(main)}
    else{flashover();};
};

var timer = false; //used in the countdown timer
var count = 60; //the countdown itself
var a = true;
var flip = false; //whether to flip the hero sprite or not

var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (edgReady) {
        ctx.drawImage(edg, 0, 0);
        ctx.drawImage(edg, 0, 968);
    }
    if (edg2Ready) {
        ctx.drawImage(edg2, 0, 0);
        ctx.drawImage(edg, 968, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }
    if (monsterReady) {
        monsterImage.src = `/images/monster/${monster.orientation}.png`;
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
    if (targetReady) {
        ctx.drawImage(targetImage, monster.target.x, monster.target.y);
    }

    // Score
    ctx.fillStyle = "rgb(0, 250, 0)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Captures: " + monstersCaught, 32, 32);

    // Score
    ctx.fillStyle = "rgb(250, 0, 0)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Targets Lost: " + monster.targetsLost, 32, 64);

    triangulation();

    //logic for the timer
    if(monster.targetsLost > monstersCaught){ //activates if hero is losing
        timer = true;
    }else{
        timer = false;
    }
    if(timer){ //render countdown
        ctx.fillStyle = "rgb(250, 250, 0)";
        ctx.font = "24px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`Countdown: ${count}`, 32, 96);
    }
}

//for displaying the pathfinding
function triangulation() {
    const targetX = monster.target.x + 32 / 2;
    const targetY = monster.target.y + 32 / 2;
    if(monster.dx <= monster.dy){
        ctx.setLineDash([10, 10]);
        ctx.globalAlpha = 0.25;
        const originX = monster.x + 56 / 2;
        const originY = monster.y + 24 / 2;

        ctx.beginPath();
        ctx.moveTo(originX, originY); // Start from the current position of the monster
        ctx.lineTo(targetX, originY); // Draw a line to the target position along the horizontal axis
        ctx.lineTo(targetX, targetY); // Draw a line to the target position
        ctx.strokeStyle = 'red'; // Set the color of the line
        ctx.lineWidth = 10; // Set the width of the line
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }else{
        ctx.setLineDash([10, 10]);
        ctx.globalAlpha = 0.25;
        const originX = monster.x + 24 / 2;
        const originY = monster.y + 56 / 2;

        ctx.beginPath();
        ctx.moveTo(originX, originY); // Start from the current position of the monster
        ctx.lineTo(originX, targetY); // Draw a line to the target position along the vertical axis
        ctx.lineTo(targetX, targetY); // Draw a line to the target position
        ctx.strokeStyle = 'red'; // Set the color of the line
        ctx.lineWidth = 10; // Set the width of the line
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
}

//flashes gameover screen
function flashover(){
    if(a == true){
        ctx.fillStyle = "rgb(250, 0, 0)";
        ctx.font = "128px Helvetica";
        ctx.textAlign = "top";
        ctx.textBaseline = "left";
        ctx.fillText("Gameover", 200, 500);
        
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "64px Helvetica";
        ctx.textAlign = "top";
        ctx.textBaseline = "left";
        ctx.fillText("(Refresh to restart!)", 210, 615);
        a = false;
    }
    else{
        ctx.fillStyle = "rgb(0, 250, 0)";
        ctx.font = "128px Helvetica";
        ctx.textAlign = "top";
        ctx.textBaseline = "left";
        ctx.fillText("Gameover", 200, 500);
        a = true;
    }
    requestAnimationFrame(flashover);
}

function intervals() {
    var countdown = setInterval(function() { //the timer
        if(timer){
            count--;
        }else{
            count = 60;
        }
        if (count <= 0) {
            clearInterval(countdown);
            stopgame = true;
        }
    }, 1000);

    var spriteFrame = setInterval(function() { //the sprite animation
        if(!noKeysPressed()){
            hero.updateSprite();
        }else{
            
        }
    }, 250);
}
window.addEventListener('load', (event) => {intervals(); });

// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0,  // where on the canvas are they?
    image: 1,
    updateSprite: function () {
        if(flip){
            heroImage.src = `images/character/${this.image}f.png`;
        }else{
            heroImage.src = `images/character/${this.image}.png`;
        }
        console.log(`images/character/${this.image}.png`)
        if(this.image < 8){
            this.image++;
        }else{
            this.image = 1;
        }
    }
}
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function(e) {
    if (e.keyCode === 16) { // Shift key
        isShiftPressed = true;
    } else {
        keysDown[e.keyCode] = true;
    }
}, false);

addEventListener("keyup", function(e) {
    if (e.keyCode === 16) { // Shift key
        isShiftPressed = false;
    } else {
        delete keysDown[e.keyCode];
    }
}, false);

//to simplify update function/make more readable
function checkKey(keyCode) { return keyCode in keysDown; };
function keyUp(){ return (checkKey(38) || checkKey(87)); };
function keyDown(){ return (checkKey(40) || checkKey(83)); };
function keyLeft(){ return (checkKey(37) || checkKey(65)); };
function keyRight(){ return (checkKey(39) || checkKey(68)); };
var noKeysPressed = () => {
    if (Object.keys(keysDown).length === 0) {
        return true;
    } else {
        return false;
    }
}

var isShiftPressed = false; //for sprint action
// Update game objects
var update = function (modifier) {
    var speedModifier = isShiftPressed ? 3 : 1; //if shift is pressed then equal 3, else equal 1
    var heroMults = hero.speed * modifier * speedModifier;

    if (keyUp() && hero.y > 32+4) { //  holding up keys
        hero.y -= heroMults;
    }
    if (keyDown() && hero.y < canvas.height - (64 + 6)) { //  holding down keys
        hero.y += heroMults;
    }
    if (keyLeft() && hero.x > (32+4)) { // holding left keys
        hero.x -= heroMults;
        if(!flip){flip = true};
    }
    if (keyRight() && hero.x < canvas.width - (64 + 6)) { // holding right keys
        hero.x += heroMults;
        if(flip){flip = false};
    }

    moveMonster();

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        var audio = new Audio('sounds/boop.mp3');
        audio.play();
        ++monstersCaught; // keep track of our “score”
        reset(); // start a new cycle
    }
};

// Reset the game when the player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

//Place the monster somewhere on the screen randomly
// but not in the hedges, Article in wrong, the 64 needs to be 
// hedge 32 + hedge 32 + char 32 = 96
    monster.x = 32 + (Math.random() * (canvas.width - 96));
    monster.y = 32 + (Math.random() * (canvas.height - 96));
};

// Let's play this game!
var then = Date.now();
reset();
main();  // call the main game loop.