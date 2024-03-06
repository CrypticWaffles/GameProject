var monster = {
    speed: 256, // movement in pixels per second
    x: 0,  // where on the canvas are they?
    y: 0,  // where on the canvas are they?
    dx: 0, // x distance from target
    dy: 0, // y distance from target
    target: {
        x: Math.round((Math.random() * 1000)),
        y: Math.round((Math.random() * 1000))
    },

    moveUp: function () {
        this.y -= 2;
    },
    moveDown: function () {
        this.y += 2;
    },
    moveLeft: function () {
        this.x -= 2;
    },
    moveRight: function () {
        this.x += 2;
    },
    newTarget: function () {
        this.target.x = Math.round((Math.random() * 1000));
        this.target.y = Math.round((Math.random() * 1000));
    },
    calcDistance: function (){ //how far the monster has to move to reach the random point
        this.dx = this.target.x - this.x;
        this.dy = this.target.y - this.y;
    }
}

function moveHorizontal(dx, dy) {
    // If moving horizontally is shorter or equal and distance is greater than 30
    if (monster.target.x < monster.x) {
        monster.moveLeft();
    } else if (monster.target.x > monster.x) {
        monster.moveRight();
    }
    monster.calcDistance();
}

function moveVertical(dx, dy) {
    // If moving vertically is shorter and distance is greater than 30
    if (monster.target.y < monster.y) {
        monster.moveUp();
    } else if (monster.target.y > monster.y) {
        monster.moveDown();
    }
    monster.calcDistance();
}

function moveMonster(){
    const dx = Math.abs(Math.round(monster.target.x - monster.x));
    const dy = Math.abs(Math.round(monster.target.y - monster.y));

    if(dx <= 3 && dy <= 3){
        // If the monster is within 30 units of its target, respawn or set a new target
        monster.newTarget();
        return;
    }else{
        if(dx<=dy && dx>3){
            moveHorizontal(dx, dy);
        }
        else if (dx>dy && dy<=3){
            moveHorizontal(dx, dy);
        }
        else if(dx<=dy && dx<=3){
            moveVertical(dx, dy);
        }
        else if(dy<=dx && dy>3){
            moveVertical(dx, dy);
        }
    }
}

export {monster, moveMonster};