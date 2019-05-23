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
	for(var i = 0; i < 65; i++) dots.push(new Dot(ranRange(0, cnv.width), ranRange(0, cnv.height), ranRange(-10,10)/10, ranRange(-10,10)/10, "white"));

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
	rect(0, 0, cnv.width, cnv.height, "rgb(5,5,5)");

	//Update pos & draw
	ctx.fillStyle = "white";
	for(var i = 0; i < dots.length; i++){
		//Move dots
		dots[i].move();

		//Draw dots
		circ(dots[i].x, dots[i].y, dots[i].r);
	}

	//Connect all close dots
	//ctx.strokeStyle = c_blue;
	for(var i = 0; i < dots.length; i++){
		connect();
	}
	//ctx.stroke();
}

function rect(x, y, w, h, c){
	ctx.fillStyle = c;
	ctx.fillRect(x, y, w, h);
	ctx.closePath();
}

function circ(x, y, r){
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

//Generate random int between range
function ranRange(minVal, maxVal){
	return Math.floor(Math.random() * (maxVal - minVal)) + minVal;
}

//Draw line between dots
function connect(){
	//Enumerate all dots (besides last)
	for(var i = 0; i < dots.length - 1; i++){
		//check any dot that hasn't already been checked for current dot
		for(var j = i + 1; j < dots.length; j++){
			//calculate x and y offset of current dot to another dot
			var x_diff = dots[i].x - dots[j].x;
			var y_diff = dots[i].y - dots[j].y;
			//calculate direct distance to another dot
			var dist = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));

			//Connect dots if distance is less than 120
			if(dist <= 120){
				ctx.beginPath();

				ctx.strokeStyle = "hsl(206,88%," + ((1 - (dist/120)) * 100) + "%)";

				ctx.moveTo(dots[i].x, dots[i].y);
				ctx.lineTo(dots[j].x, dots[j].y);

				ctx.stroke();

				ctx.closePath();
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
		//set velocity if dot near mouse
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

		//If moving off left side
		if(this.x - this.r + this.sx <= 0){
			this.x = this.r;
			this.sx *= -1;
			this.vx *= -1;
		}
		//if moving off right side
		else if(this.x + this.r + this.sx >= cnv.width){
			this.x = cnv.width - this.r;
			this.sx *= -1;
			this.vx *= -1;
		}
		//if moving off top side
		else if(this.y - this.r + this.sy <= 0){
			this.y = this.r;
			this.sy *= -1;
			this.vy *= -1;
		}
		//if moving off bottom side
		else if(this.y + this.r + this.sy >= cnv.height){
			this.y = cnv.height - this.r;
			this.sy *= -1;
			this.vy *= -1;
		}
	}
}
