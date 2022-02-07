var ballAmount = 220;
var ballSpeed = 1.3;
var ballSize = 2.5;
var ballShadowBlur = 15;
var ballGlowDistance = 250;
var ballMinAlpha = 0.04;

var lineMaxDistance = 200;
var lineMaxLength = 175;
var lineSize = 0.3;
var lineShadowBlur = 10;

const canvas = document.getElementById('background');
const c = canvas.getContext('2d');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

var balls = [];
const mouse = {
	x: canvas.clientWidth / 2,
	y: canvas.clientHeight / 2
}
setBall();
animate();

window.addEventListener('mousemove', function(event){
	mouse.x = event.x;
	mouse.y = event.clientY;
});

window.addEventListener('resize', function(event) {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;	
});

function random(max) {
	return Math.floor(Math.random() * max);
}

function distance(x1,y1,x2,y2) {
	var x = x1-x2;
	var y = y1-y2;
	return Math.sqrt((x * x) + (y * y));
}

function distanceFromMouse(x,y) {
	return distance(x,y,mouse.x,mouse.y);
}

function Ball(x,y,d) {
	this.x = x;
	this.y = y;
	this.d = directionToXYPower(d);
	this.px = this.d.x;
	this.py = this.d.y;
	this.speed = (Math.random()+0.1);

	this.draw = function(){
		var dm = distanceFromMouse(this.x,this.y);
		var alpha = 1-dm/ballGlowDistance;
		if(alpha < ballMinAlpha){
			alpha = ballMinAlpha;
		}
		c.beginPath();
		c.arc(this.x,this.y,ballSize,Math.PI * 2,false);
		c.fillStyle = "rgba(255,255,255,"+alpha+")";
		if(alpha > ballMinAlpha){
			c.shadowColor = "rgba(255,200,200,"+alpha+")";
			c.shadowBlur = ballShadowBlur;
		}
		c.fill();
	}
	this.update = function(){
		if(this.x-ballSize < 0 || this.x+ballSize > canvas.clientWidth){
			this.px = -this.px;
		}
		var newX = this.x+this.speed*ballSpeed*this.px;
		this.x = newX;
		if(this.y-ballSize < 0 || this.y+ballSize > canvas.clientHeight){
			this.py = -this.py;
		}
		var newY = this.y+this.speed*ballSpeed*this.py;
		this.y = newY;
	}
}

function directionToXYPower(d) {
	var dx = 0;
	var dy = 0;
	if(d >= 270){
		var i1 = d-270;
		dx = -(1-i1/90);
		dy = -(i1/90);
	}
	else if(d >= 180){
		var i1 = d-180;
		dx = -(i1/90);
		dy = 1-i1/90;
	}
	else if(d >= 90){
		var i1 = d-90;
		dx = 1-i1/90;
		dy = i1/90;
	} else {
		dx = d/90;
		dy = -(1-d/90);
	}
	return {
		x: dx,
		y: dy,
	}
}

function setBall() {
	for (let i = 0; i < ballAmount; i++) {
		balls.push(new Ball(random(canvas.width+1),random(canvas.height+1),random(361)));
	}
}

var lastTime = 0;
var fpsCount = 0;

function animate() {
	var time = new Date().getTime();
	fpsCount++;
	if(time-lastTime >= 1000){
		console.log(fpsCount,time);
		lastTime = time;
		fpsCount = 0;
	}
	requestAnimationFrame(animate);

	c.clearRect(0,0,canvas.width,canvas.height)

	var lightupBalls = [];
	for (const key in balls) {
		const b = balls[key];
		b.update();
		if(distanceFromMouse(b.x,b.y) <= lineMaxDistance){
			lightupBalls.push(b);
		} else {
			b.draw();
		}
	}
	for (const key in lightupBalls) {
		const b = lightupBalls[key];
		for (const key2 in lightupBalls) {
			const b2 = lightupBalls[key2];
			if(b == b2) continue;
			if(distance(b.x,b.y,b2.x,b2.y) <= lineMaxLength){
				c.beginPath();
				c.moveTo(b.x,b.y);
				c.lineTo(b2.x,b2.y);
				c.strokeStyle = "rgba(255,255,255,0.9)";
				c.lineWidth = lineSize;

				c.shadowColor = "blue";
				c.shadowBlur = lineShadowBlur;

				c.stroke();
			}
		}
	}
	for (const key in lightupBalls) {
		const b = lightupBalls[key];
		b.draw();
	}
}