/**
 * This is the setup file. It gets imported in line 1 of index.js
 * If you are going to modify it,
 *    make sure to add any new variables to the export at the bottom of the file
 *    and to add it to index.js as shown in lines 3 through 9
 */

// Canvas creation
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);
/* Canvas Coordinates Cheat Sheet
 * ------------------------------
 * Top-left: (0, 0)
 * Bottom-left: (0, 1000)
 * Top-right: (1000, 0)
 * Bottom-right: (1000, 1000)
 * Center: (500, 500)
 */

// Images
// Background Image
var bgReady = true;
var bgImage = new Image();
bgImage.src = "images/SpaceBG.png";

//Edges
// Background Image
var edgReady = false;
var edgImage = new Image();
edgImage.onload = function () {
    edgReady = true;
}
//edgImage.src = "images/border1.png";

// Background Image
var edg2Ready = false;
var edg2Image = new Image();
edg2Image.onload = function () {
    edg2Ready = true;
}
//edg2Image.src = "images/.png";

// Hero Image
var heroReady = true;
var heroImage = new Image();
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = true;
var monsterImage = new Image();
monsterImage.src = "images/monster.png";

// Target image
var targetReady = true;
var targetImage = new Image();
targetImage.src = "images/target.png";

export { 
    canvas, ctx,
    bgReady, bgImage,
    edgReady, edgImage, edg2Ready, edg2Image,
    heroReady, heroImage,
    monsterReady, monsterImage,
    targetReady, targetImage
};