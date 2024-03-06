import * as setup from "./setup.js";
import * as monst from "./monster.js";
import { moveMonster } from "./monster.js";

var {
    canvas, ctx,
    bgReady, bgImage,
    edgReady, edgImage, edg2Ready, edg2Image,
    heroReady, heroImage,
    monsterReady, monsterImage
} = setup;

var {
    monster
} = monst;

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    //  Request to do this again ASAP
    requestAnimationFrame(main);
};

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
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
}

// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0  // where on the canvas are they?
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
    }
    if (keyRight() && hero.x < canvas.width - (64 + 6)) { // holding right keys
        hero.x += heroMults;
    }

    moveMonster();

    // Are they touching?
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
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