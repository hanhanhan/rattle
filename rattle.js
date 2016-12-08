'use strict';
//canvas
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
context.lineWidth = 3;
context.fillStyle = 'white';
context.strokeStyle = 'gray';

//rattle
let length = 3; //number of beads on rattle
let radius = 15;
let restDist = canvas.width/(length + 2);
let xInit = canvas.width/(length + 2);
let yInit = canvas.height/2;
let timeStep = 0.2;
let relaxationCount = 1; 
let springX = 1;
let springY = 1;

let mouse = {
    down: false,
    x: null,
    y: null
};

class Point {
    constructor(x, y){
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.xPrior = x;
        this.yPrior = y;
        this.xAcceleration = 0;
        this.yAcceleration = 0;
        this.timeStep = timeStep;
        this.neighbor = null;
    }


    //update x,y position based on previous position
    update(){
        if(mouse.down){
            let xDiff = mouse.x - this.x;
            let yDiff = mouse.y - this.y;
            let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
          
            if(distance < radius){
                this.xPrior = this.x;
                this.yPrior = this.y;
                this.x = mouse.x;
                this.y = mouse.y; 
            }
        }

        // let xDiff = this.x - this.xPrior; //could divide by resting length -- like spring;
        // let yDiff = this.y - this.yPrior;
        // let xNext = this.x + xDiff * springX; //could add acceleration term for fun
        // let yNext = this.y + yDiff * springY;
        
        // this.xPrior = this.x;
        // this.yPrior = this.y;
        
        // this.x = xNext;
        // this.y = yNext;

        return this; //allow method chaining
    }


    pulling(){
        if(!this.neighbor){ return; }

        let dx = this.x - this.neighbor.x;
        let dy = this.y - this.neighbor.y;
        let dist = Math.sqrt(dx * dx + dy * dy);   
        //approximation of velocity?
        let diff = (dist - restDist)/dist; //try dividing by restDist variation
        let xShift = dx * diff * 0.5;
        let yShift = dy * diff * 0.5;

        this.x += xShift;
        this.y += yShift;

        this.neighbor.x += xShift;
        this.neighbor.y += yShift;
    }

    draw(){
        //context.moveTo(this.x + radius, this.y);
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    }
}

// class Constraint{
//     constructor(p1, p2){
//         this.p1.x = p1.x;
//         this.p2.x = p2.x;
//         this.p1.y = p1.y;
//         this.p2.y = p2.y;
//     }
//     pulling(){
//         let dx = this.p1.x - this.p2.x;
//         let dy = this.p1.y - this.p2.y;
//         let dist = Math.sqrt(dx * dx + dy * dy);   
//         //approximation of velocity?
//         let diff = (dist - restDist)/dist; //try dividing by restDist variation
//         let xShift = dx * diff * 0.5;
//         let yShift = dy * diff * 0.5;

//         this.p1.x += xShift;
//         this.p1.y += yShift;
//         this.p2.x += xShift;
//         this.p2.y += yShift;
//     }
//     //cloth example put draw method in here.
// }

class Points {
    constructor(){
        this.points = [];
        let x = xInit;
        let y = yInit;
        for(let i = 0; i < length; i++){ //redefinition of length in while loop? 
            let point = new Point(x, y);
            // kosher?
            // i !== 0 && constraint = points[i-1];
            let neighbor = i ? this.points[i - 1] : null;
            point.neighbor = neighbor;
            this.points.push(point);
            //vs points.push(point) ??
            x += restDist;
        }
    }
    updateAndDraw(){
        //Relaxation -- solve repeatedly for constraints
        for(let i = 0; i < relaxationCount; i++){
            this.points.forEach(point => point.pulling());
        }
        //update canvas for mouse movement and draw
        context.beginPath(); 
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.points.forEach(point => point.update().draw());
        context.stroke();
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
    if (!mouse.down){ 
        return; 
    }
    mouse.x = Math.floor(e.x - canvas.getBoundingClientRect().left);
    mouse.y = Math.floor(e.y - canvas.getBoundingClientRect().top);
}

//initialization
let rattle = new Points();
animationLoop();

function animationLoop(){
    rattle.updateAndDraw();
    window.requestAnimationFrame(animationLoop);
}

