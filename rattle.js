'use strict';
//canvas
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 300;
context.lineWidth = 3;

//rattle
let length = 10;
let radius = 15;
let spacing = canvas.width/(length + 2);
let xInit = canvas.width/(length + 2);
let yInit = canvas.height/2;

//point object
class Point {
    constructor(x, y){
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.xPrior = x;
        this.yPrior = y;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
    }

    update(timeStep){
        //one path based on mouse interaction - set "prior" xy to mouse coords
        //otherwise nothing
        return this;
    }

    draw(){
        context.moveTo(this.x + radius, this.y);
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        context.stroke();
    }
}

class Points {
    constructor(){
        this.points = [];
        let x = xInit;
        let y = yInit;
        while(length--){ //redefinition of length? 
            let point = new Point(x, y);
            this.points.push(point);
            x += spacing;
            //vs points.push(point) ??
        }
    }
    draw(){
        this.points.forEach(point => point.draw())
    }
}


//constraints

//points object


//initial call
let rattle = new Points();
//context.beginPath();
rattle.draw();
//context.stroke();
//animation loop
