'use strict';
//canvas
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
context.lineWidth = 3;
context.fillStyle = 'white';
context.strokeStyle = 'gray';

//points
let pointsCount = 30; //number of beads on points
let radius = 30;
let restDist = canvas.width/(pointsCount + 2);
let xInit = canvas.width/(pointsCount + 2);
let yInit = canvas.height/2;
let relaxationCount = 50; 
let springX = 0.0001;
let springY = 0.0003;

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
        this.neighbor = null;
        this.pinned = false;
        this.color = 'orange';
    }

    //update x,y position based on previous position
    checkMouse(){
        if(mouse.down){
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
          
            if(distance < radius){
                this.x = mouse.x;
                this.y = mouse.y; 
            }
        }

        if(this.x > canvas.width - radius){
            this.x = canvas.width - radius;
        }
        if(this.x < radius){
            this.x = radius;
        }
        if(this.y > canvas.height - radius){
            this.y = canvas.height - radius;
        }
        if(this.y < radius){
            this.y = radius;
        }

        return this; //allow method chaining
    }


    pulling(){
        if(!this.neighbor) return;

        let dx = this.x - this.neighbor.x;
        let dy = this.y - this.neighbor.y;
        let dist = Math.sqrt(dx * dx + dy * dy);  

        let diff = (restDist - dist)/(dist+0.005); //try dividing by restDist variation
        
        let xShift = dx * diff * springX;
        let yShift = dy * diff * springY;

        this.x += xShift;
        this.y += yShift;

        this.neighbor.x += xShift;
        this.neighbor.y += yShift;
    }

    draw(){     
        context.beginPath()
        context.fillStyle = this.color;
        context.strokeStyle = this.color;
        context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
        if(this.neighbor){
            context.moveTo(this.x - radius, this.y);
            context.lineTo(this.neighbor.x + radius, this.neighbor.y);
        }
        context.fill();
        context.stroke();
        context.closePath();
    }
}

class Points {
    constructor(){
        this.points = [];
        let x = xInit;
        let y = yInit;
        for(let i = 0; i < pointsCount; i++){ 
            let point = new Point(x, y);
            let neighbor = i ? this.points[i - 1] : null;
            point.neighbor = neighbor;
            point.color = colorMaker(5, i, i, pointsCount);
            this.points.push(point);
            x += restDist;
        }
    }
    updateAndDraw(){
        //Relaxation -- solve repeatedly for constraints
        for(let i = 0; i < relaxationCount; i++){
            this.points.forEach(point => point.pulling());
        }
        //update canvas 
        context.beginPath(); 
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.points.forEach(point => point.checkMouse().draw());
    }
}

function colorMaker(rCounter, gCounter, bCounter, length){
    let r = 40;
    let g = (length - gCounter) * 255 / length;
    let b = bCounter * 255 / length;
    let alpha = 0.8;
    return 'rgba(' + r + ','+ g + ',' + b + ','+ alpha +')';
}

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
let points = new Points();
animationLoop();

function animationLoop(){
    points.updateAndDraw();
    window.requestAnimationFrame(animationLoop);
}