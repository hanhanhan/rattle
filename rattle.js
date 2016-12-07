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

let mouse = {
    down: false,
    x: null,
    y: null
}

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

    update(){
        if(mouse.down){
            let xDiff = mouse.x - this.x;
            let yDiff = mouse.y - this.y;
            let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
            console.log(distance);
          
            if(distance < radius){
                this.xPrior = this.x;
                this.yPrior = this.y;
                this.x = mouse.x;
                this.y = mouse.y;
                console.log(distance);
            }
        }
        return this;
    }

    draw(){
        //context.moveTo(this.x + radius, this.y);
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
    updateAndDraw(){
        this.points.forEach(point => point.update().draw())
    }
}


//constraints

//points object

//user interaction
window.onmousedown = () => mouse.down = true;
window.onmouseup = () => mouse.down = false;

window.onmousemove = mouseMovement;

function mouseMovement(e){
    //another way to prevent this event listener from firing if mouse.down = false?
    //is it worthwhile savings?
    // if (!mouse.down){ 
    //     return; 
    // }
    mouse.x = e.x - canvas.getBoundingClientRect().left;
    mouse.y = e.y - canvas.getBoundingClientRect().top;
}


//initialization
let rattle = new Points();
animationLoop();

function animationLoop(){
    //context.beginPath();
    rattle.updateAndDraw();
    //context.stroke();
    window.requestAnimationFrame(animationLoop);
}

