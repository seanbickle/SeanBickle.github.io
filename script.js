//Canvas obj & ctx
var cnv;
var ctx;
//Colours
var c_blue = "rgb(76, 170, 247)";
//Dots
var dots = [];
//Mouse x + y;
var mx = my = -100;
//DOM elements
var title;

window.onload=function(){
	//Canvas objs
	cnv = document.getElementById("canvas");
	ctx = cnv.getContext("2d");
	//Initialise canvas size to fill screen
	resize();

	//DOM elements
	title = document.getElementById("title");

	//Event Listeners
	window.addEventListener("resize", resize);
	window.addEventListener("mousemove", movemouse);
	title.addEventListener("click", launchMelons);

	//Initialise dots
	for(var i = 0; i < 100; i++) dots.push(new Dot(ranRange(0, cnv.width), ranRange(0, cnv.height), ranRange(-10,10)/10, ranRange(-10,10)/10, "white"));

	//Refresh
	setInterval(refresh, 1000/60);
}

function launchMelons(){
	window.location = "melons/index.htm";
}

function resize(){
	cnv.height = window.innerHeight;
	cnv.width = window.innerWidth;
}

function refresh(){
	//Draw background
	ctx.fillStyle = "rgb(5,5,5)"
	rect(0, 0, cnv.width, cnv.height, "");

	//Update pos & draw
	ctx.fillStyle = "white";
	for(var i = 0; i < dots.length; i++){
		//Move dots
		dots[i].move();

		//Draw dots
		circ(dots[i].x, dots[i].y, dots[i].r, dots[i].c);
	}
	ctx.fill();

	//Connect all close dots
	ctx.strokeStyle = c_blue;
	for(var i = 0; i < dots.length; i++){
		connect();
	}
	ctx.stroke();
}

function rect(x, y, w, h, c){
	//ctx.fillStyle = c;
	ctx.fillRect(x, y, w, h);
	ctx.closePath();
}

function circ(x, y, r, c){
	//ctx.fillStyle = c;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
}

//Generate random int between range
function ranRange(minVal, maxVal){
	return Math.floor(Math.random() * (maxVal - minVal)) + minVal;
}

function connect(){
	//check all dots except last
	for(var i = 0; i < dots.length - 1; i++){
		//check any dot that hasn't already been checked for current dot
		for(var j = i + 1; j < dots.length; j++){
			var x_diff = dots[i].x - dots[j].x;
			var y_diff = dots[i].y - dots[j].y;
			var dist = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));

			//Check distance between dots
			if(dist <= 120){
				//Draw line between points
				ctx.moveTo(dots[i].x, dots[i].y);
				ctx.lineTo(dots[j].x, dots[j].y);
			}
		}
	}
}

//Get mouse x + y
function movemouse(e){
	mx = e.clientX;
	my = e.clientY;
}

//dot class
class Dot {
	constructor(x, y, sx, sy, c) {
		this.x = x;
		this.y = y;
		this.r = 3;
		this.c = c;
		this.sx = sx;
		this.sy = sy;
		this.vx = 0;
		this.vy = 0;
	}

	move(){
		//set velocity
		if(Math.abs(this.x - mx) < 10 && Math.abs(this.y - my) < 50){
			this.sx *= -1;
			this.sy *= -1;

			if(mx < this.x && my < this.y){
				this.vx = 5;
				this.vy = 5;
			}else if(mx > this.x && my > this.y){
				this.vx = -5;
				this.vy = -5;
			}else if(mx < this.x && my > this.y){
				this.vx = 5;
				this.vy = -5;
			}else{
				this.vx = -5;
				this.vy = 5;
			}
			console.log("move");
		}

		//Move based on speed
		this.x += this.sx + this.vx;
		this.y += this.sy + this.vy;

		//Reduce velocity
		if(this.vx != 0){
			if(this.vx > 0) this.vx-=0.1;
			else this.vx+=0.1;

			if(this.vy > 0) this.vy-=0.1;
			else this.vy+=0.1;

		}

		//Check if off edge horizontally
		if(this.x + this.r > cnv.width || this.x - this.r < 0){
			this.sx *= -1;
			this.vx *= -1;
		}

		if(this.y + this.r > cnv.height || this.y - this.r < 0){
			this.sy *= -1;
			this.vy *= -1;
		}
	}
}
