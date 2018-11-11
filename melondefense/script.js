//Game start time
var gameStart = 0;
//Player object
var plr;
//Pumpkin enemies
var pk = new Array(1);
//Melons
var mn;
//background img grass
var bimg = new Image();
var bpat;
//HTML objects
var grenadeBtn = document.getElementById("grenade_text");
var compostBtn = document.getElementById("compost_text");
var gameLoop = true;
var highScore = 0;

window.onload = function(){
	//GAME CANVAS
	//setup canvas
	cnv = document.getElementById('cnv');
	ctx = cnv.getContext('2d');
	//get canvas height and width
	winWidth = cnv.width;
	winHeight = cnv.height;
	//background
	bimg.src = "res/grass.png";
	
	//Initialise plr obj
	plr = new Player();
	//initialise pumkins and melons
	pk = [new Pumpkin()];
	initMelons();
	//Update window for changes in scale
	updateWindow();
	
	//Document objs
	pkCounter = document.getElementById("pumpkin_count");
	plrHealth = document.getElementById("plr_health");
	moveUpgrade = document.getElementById("movement_upgrade"); 
	
	//Player move
	document.addEventListener("keypress", btnPress);
	document.addEventListener("keyup", stopMoving);
	//On window scale change
	window.addEventListener("resize", updateWindow);
	
	//movement upgrade button
	moveUpgrade.addEventListener("click", upgradeMovement);
	document.getElementById("melee_upgrade").addEventListener("click", upgradeMelee);
	document.getElementById("compost_upgrade").addEventListener("click", upgradeCompost);
	document.getElementById("grenade_upgrade").addEventListener("click", upgradeGrenade);
	
	//Clicking footer buttons
	document.getElementById("instagram").addEventListener("click", function(){
		window.open('http://www.instagram.com/sean_bickle3', '_blank');
	});
	document.getElementById("linkedin").addEventListener("click", function(){
		window.open('http://www.linkedin.com/in/sean-bickle-6255a511b', '_blank');
	});
	
	//Melee button pressed
	document.getElementById("melee_text").addEventListener("click", plr.fight);
	//Grenade button press
	grenadeBtn.addEventListener("click", useGrenade);
	//Grenade button press
	compostBtn.addEventListener("click", useCompost);
	//restartPressed
	document.getElementById("restartLink").addEventListener("click", resetGame);
	
	//get local storage high score
	if(localStorage.getItem("highScore") != null){
		highScore = localStorage.getItem("highScore");
	}
	
	
	gameStart = Math.floor(performance.now() / 1000);
	setInterval(refresh, 1000/60);
}

function resetGame(){
	//Reset player vals
	plr.resetVals();
	//Reset melons
	initMelons();
	//Reset pumpkin array and initial val
	pk = [new Pumpkin()];
	
	//reset end screen
	document.getElementById("gameOver").innerHTML = "";
	document.getElementById("endScore").innerHTML = "";
	document.getElementsByTagName("header")[0].style.height = "50px";
	document.getElementById("highScore").style.height = "0px";
	document.getElementById("restartLink").style.height = "0px";
	
	pkCounter.innerHTML = "0";
	
	//Resume game loop
	gameStart = Math.floor(performance.now() / 1000);
	gameLoop = true;
}

class Player{
	constructor(){
		this.h = 100;
		this.w = 100;
		this.x = (0.5 * winWidth) - (0.5*this.w);
		this.y = winHeight - 270;
		this.c = "white"; //Color
		this.s = 10;
		this.dir = 0;
		//Pumpkin score
		this.pkCount = 0;
		this.health = 100;
		this.reach = 100;
		//Movement upgrades
		this.uMoveCosts = [100, 500, 1000, 1500, 2000];
		this.uMoveCounter = 0;
		//Compost upgrades
		this.compost = 0;
		//Grenade upgrades
		this.grenade = 0;
	}
	
	draw(){
		ctx.strokeStyle = "white";
		ctx.setLineDash([9, 10]);
		ctx.strokeRect(this.x-this.reach, this.y-this.reach, this.w +(this.reach * 2),this.h+(this.reach * 2));
		drawRect(this.x, this.y, this.h, this.w, this.c);
	}
	
	move(){
		this.x += this.s * this.dir;
	}
	
	update(){
		//Move player
		this.move();
		
		//Draw player
		this.draw();
	}
	
	fight(){
		//Check if pumpkin collision
		for(var i = 0; i < pk.length; i++){
			//check for pumpkins
			if(inRange(pk[i], this, this.reach)){
				pk[i].repos();
				//Increase player pumpkin count
				this.kill(10);
				//add pumpkin if a number between 1 and range of pumpkins = 1; fewer added as number increases
				if(ranRange(1,pk.length) == 1) pk.push(new Pumpkin());
			}
			
			//Check for pumpkin projectiles
			if(inRange(pk[i].p, this, this.reach)){
				pk[i].p.repos();
				//Increase player pumpkin count
				this.kill(5);
			}
		}
	}
	
	resetVals(){
		this.x = (0.5 * winWidth) - (0.5*this.w);
		this.s = 10;
		this.dir = 0;
		//Pumpkin score
		this.pkCount = 0;
		this.health = 100;
		this.reach = 100;
		//Movement upgrades
		this.uMoveCounter = 0;
		//Compost upgrades
		this.compost = 0;
		//Grenade upgrades
		this.grenade = 0;
		pkCounter.innerHTML = this.pkCount;
	}
	
	kill(quant){
		this.pkCount += quant;
		pkCounter.innerHTML = this.pkCount;
	}
	
	hit(){
		--this.health;
		plrHealth.innerHTML = "health: " + this.health; 
		
		if(this.health <= 0){
			endGame(); 
		}
	}
}

function endGame(){
	//Stop game
	gameLoop = false;
	
	document.getElementsByTagName("header")[0].style.height = "100%";
	//Set end text
	document.getElementById("gameOver").innerHTML = "pumpkins win, again.";
	//Set score
	var finalScore = (Math.floor(performance.now()/1000) - gameStart);
	
	//check high score
	if(highScore < finalScore){
		document.getElementById("highScore").style.height = "50px";
		console.log(finalScore);
		localStorage.setItem("highScore", finalScore);
	}
	
	document.getElementById("restartLink").style.height = "80px";
	document.getElementById("endScore").innerHTML = "you protected your melons for <span style='color: rgb(119,221,119); font-weight: bold;'>" + finalScore + "</span> seconds";
}

function upgradeMovement(){
	if(plr.uMoveCounter < plr.uMoveCosts.length && plr.pkCount >= plr.uMoveCosts[plr.uMoveCounter]){
		//Apply upgrade
		plr.s += 3;
		//increase number of times movement upgraded
		++plr.uMoveCounter;
		
		document.getElementById("movement_text").innerHTML = "movement (a / d), speed: " + plr.s;
		
		//Update upgrade button text with new cost
		if(plr.uMoveCounter < plr.uMoveCosts.length){
			moveUpgrade.innerHTML = plr.uMoveCosts[plr.uMoveCounter] + ": +3 speed";
		}else{
			moveUpgrade.innerHTML = "fully upgraded"
		}
	}
}

function upgradeMelee(){
	if(plr.pkCount >= 1000 && plr.reach < 300){
		plr.reach += 20;
		plr.pkCount -= 1000;
		document.getElementById("melee_text").innerHTML = "use rake (space), reach: " + plr.reach;
	}
	
	if(plr.reach == 300){
		document.getElementById("melee_upgrade").innerHTML = "fully upgraded";
	}
}

function upgradeCompost(){
	if(plr.pkCount >= 3000){
		++plr.compost;
		plr.pkCount -= 3000;
		pkCounter.innerHTML = plr.pkCount;
		document.getElementById("compost_text").innerHTML = "use compost (" + plr.compost + ") (c)"; 
	}
}

function upgradeGrenade(){
	if(plr.pkCount >= 5000){
		++plr.grenade;
		plr.pkCount -= 5000;
		pkCounter.innerHTML = plr.pkCount;
		grenadeBtn.innerHTML = "use grenade (" + plr.grenade + ") (g)";
	}
}

function useGrenade(){
	if(plr.grenade > 0 && pk.length != 1){
		pk.splice(1);
		--plr.grenade;
		//update html text
		grenadeBtn.innerHTML = "use grenade (" + plr.grenade + ") (g)";
	}
}

function useCompost(){
	var used = false;
	if(plr.compost > 0){
		for(var i = 0; i < mn.length; i++){
			for(var j = 0; j < mn[0].length; j++){
				//if melon is unhealthy && not dead, increase its health
				if(mn[i][j].health < 5 && mn[i][j].active){
					++mn[i][j].health;
					used = true;
				}
			}
		}
	}
	
	if(used){
		--plr.compost;
		compostBtn.innerHTML = "use compost (" + plr.compost + ") (c)";
	}
}

class Melon{
	constructor(x, y){
		this.h = 50;
		this.w = 50;
		this.x = x;
		this.y = y;
		this.health = 5;
		this.active = true;
		this.img = new Image();
	}
	
	draw(){
		this.img.src = "res/melon" + this.health + ".png";
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	}
	
	hit(){
		--this.health;
		if(this.health == 0) this.active = false;
		this.draw();
	}
}

class Pumpkin{
	constructor(){
		this.h = 50;
		this.w = 50;
		this.x = ranRange(0, winWidth - this.w);
		this.y = 0 - this.h;
		this.s = ranRange(10,30)/10;
		this.p = new Projectile(ranRange(1,5));
		this.img = new Image();
		this.img.src = "res/pumpkin.png";
	}
	
	move(){
		this.y += this.s;
		
		if(this.y >= mn[mn.length - 1][0].y + mn[mn.length - 1][0].h) this.repos();
	}
	
	repos(){
		this.x = ranRange(0, winWidth - this.w);
		this.y = ranRange(0, -1500);
		this.s = ranRange(5,30)/10;
	}
	
	fire(){
		//if not off screen, fire
		if(this.y + this.h <= mn[mn.length - 1][0].y + mn[mn.length - 1][0].h){
			this.p.active = true;
			this.p.s = ranRange(3,5);
			this.p.x = this.x + (this.w / 2) - (this.p.w / 2);
			this.p.y = this.y + (this.h / 2);
		}
	}
	
	draw(){;
		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
	}
	
	checkProjectileHit(){
		var pos = Math.floor((this.p.x * 2) / 100);
		for(var i = 0; i < mn.length; i++){
			if(mn[i][pos].active){
				//Check projectile is between bounds of target pumpkin
				if(this.p.y >= mn[i][pos].y && this.p.y <= mn[i][pos].y + mn[i][pos].h){
					//Reset projectile; made a hit
					this.p.repos();
					//decrease health of melon
					mn[i][pos].hit();
				}
			}
		}
	}
	
	update(){
		//Randomly fire projectile if it doesn't already have projectile active and not off screen
		if(ranRange(1,600) == 1 && !this.p.active && this.y > this.h) this.fire();
		this.p.update();
		this.checkProjectileHit();
		this.move();
		this.draw();
	}
}

class Projectile{
	constructor(dmg){
		this.h = 30;
		this.w = 10;
		this.x = 0;
		this.y = 0;
		this.c = "rgb(255,64,0)";
		this.s = 0;
		this.active = false;
		this.dmg = dmg;
	}
	
	repos(){
		this.x = 0;
		this.y = 0;
		this.active = false;
	}
	
	move(){
		if(this.active) this.y += this.s;
		
		//If projectile hits player when all melons destroyed
		if(this.y + this.h >= mn[mn.length - 1][0].y + mn[mn.length - 1][0].h && this.active){
			this.repos();
			plr.hit();
		}
	}
	
	draw(){
		drawRect(this.x, this.y, this.h, this.w, this.c);
	}
	
	update(){
		this.move();
		this.draw();
	}
}

//Add pumpkins to array
function addPumpkins(quant){
	for(var i = 0; i < quant; i++){
		pk.push(new Pumpkin());
	}
}

//Check if enemy obj (enemy, obj) is within range of player obj (player, proj)
function inRange(enemy, plrObj, bnd){
	//if pumpkin is within 100px of player
	if(enemy.y + enemy.h >= plrObj.y - bnd){			
		//if left corner inside player boundary
		if((enemy.x >= plrObj.x - bnd && enemy.x <= plrObj.x + plrObj.w + bnd) || (enemy.x + enemy.w >= plrObj.x - bnd && enemy.x + enemy.w <= plrObj.x + plrObj.w + bnd)){
			return true;
		}
	}
}

function updateWindow(){
	cnv.height = window.innerHeight;
	winHeight = cnv.height;
	
	plr.y = winHeight - plr.h - 270;
	
	//Update melons
	for(var i = 0; i < 3; i++){
		for(var j = 0; j < 24; j++){
			//Melon = x, y + window height - UI height
			mn[i][j].y = (i * 50)+winHeight - 270;
		}
	}
}

function initMelons(){
	mn = new Array(3);
	for(var i = 0; i < 3; i++){
		mn[i] = new Array(24);
		for(var j = 0; j < 24; j++){
			//Melon = x, y + window height - UI height
			mn[i][j] = new Melon(j * 50, (i * 50)+winHeight - 270);
			//draw melon
			mn[i][j].draw();
		}
	}
}

function btnPress(e){
	//move player
	if(e.key == "a" && plr.x > 0) plr.dir = -1; 
	else if(e.key == "d" && plr.x + plr.w <= winWidth) plr.dir = 1;
	
	//fight
	if(e.key == " "){
		plr.fight();
	}
	
	//compost
	if(e.key == "c"){
		useCompost();
	}
	
	//Grenade
	if(e.key == "g"){
		useGrenade();
	}
}

function stopMoving(e){
	if(e.key == "a" || e.key== "d" ) plr.dir = 0;
}

function refresh(){
	if(gameLoop){
		//Draw background
		ctx.fillStyle = ctx.createPattern(bimg, "repeat");
		ctx.fillRect(0,0, winWidth, winHeight);
	
		//Draw player
		plr.update();
	
		//Draw melons
		for(var i = 0; i < 3; i++){
			for(var j = 0; j < 24; j++){
				mn[i][j].draw();
			}
		}
	
		//update pumpkins
		for(var i = 0; i < pk.length; i++) pk[i].update();
		
		//Update time
		document.getElementById("plr_score").innerHTML = Math.floor(performance.now()/1000) - gameStart;
	}
}

//Draw rectangle
function drawRect(x, y, h, w, colour){
	ctx.fillStyle = colour;
	ctx.fillRect(x, y, w, h);
}

//Generate random int between range 
function ranRange(minVal, maxVal){
	return Math.floor(Math.random() * (maxVal - minVal)) + minVal;
}