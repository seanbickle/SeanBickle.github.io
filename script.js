//Global canvas & context 
var cnv;
var ctx;
//Global canvas height & width
var winHeight;
var winWidth;
//Melon patches
var patches = new Array(16);
//Difficulty setting
var diff = 0;
//tool selected
var tool = 0;
//Number of melons harvested
var melons = 0;


window.onload = function(){
	//GAME CANVAS
	//setup canvas
	cnv = document.getElementById('cnv');
	ctx = cnv.getContext('2d');
	//get canvas height and width
	winWidth = cnv.width;
	winHeight = cnv.height;
	
	//Populate patches array
	initPatches();
	
	//KEY PRESSES
	//Changing cursor
	document.getElementById('can').addEventListener("click", function(){
		container.style.cursor = "url(res/canCursor.png), auto";
		tool = 3;
	});	
	document.getElementById('clippers').addEventListener("click", function(){
		container.style.cursor = "url(res/clippersCursor.png), auto";
		tool = 2;
	});	
	document.getElementById('seeds').addEventListener("click", function(){
		container.style.cursor = "url(res/seedsCursor.png), auto";
		tool = 1;
	});	
	document.getElementById('melons').addEventListener("click", function(){
		container.style.cursor = "auto";
	});	
	
	//Button press - button controls
	document.addEventListener("keydown", function(e){
		if(e.keyCode == 87){
			container.style.cursor = "url(res/canCursor.png), auto";
			tool = 3;
		}else if(e.keyCode == 83){
			container.style.cursor = "url(res/seedsCursor.png), auto";
			tool = 1;
		}else if(e.keyCode == 67){
			container.style.cursor = "url(res/clippersCursor.png), auto";
			tool = 2;
		}
	});
	
	//Clicking patches
	cnv.addEventListener("click", patchClick);
	//Clicking difficulty buttons
	document.getElementById("easy").addEventListener("click", function(){
		diff = 0;
		updateAllPatchTimes(diff);
		document.getElementById("easy").style.background = "rgba(20,20,20,0.2)";
		document.getElementById("medium").style.background = "transparent";
		document.getElementById("hard").style.background = "transparent";
		document.getElementById("farmer").style.background = "transparent";
	});
	document.getElementById("medium").addEventListener("click", function(){
		diff = 1;
		updateAllPatchTimes(diff);
		document.getElementById("medium").style.background = "rgba(20,20,20,0.2)";
		document.getElementById("easy").style.background = "transparent";
		document.getElementById("hard").style.background = "transparent";
		document.getElementById("farmer").style.background = "transparent";
	});
	document.getElementById("hard").addEventListener("click", function(){
		diff = 2;
		updateAllPatchTimes(diff);
		document.getElementById("hard").style.background = "rgba(20,20,20,0.2)";
		document.getElementById("medium").style.background = "transparent";
		document.getElementById("easy").style.background = "transparent";
		document.getElementById("farmer").style.background = "transparent";
	});
	document.getElementById("farmer").addEventListener("click", function(){
		diff = 3;
		updateAllPatchTimes(diff);
		document.getElementById("farmer").style.background = "rgba(20,20,20,0.2)";
		document.getElementById("medium").style.background = "transparent";
		document.getElementById("hard").style.background = "transparent";
		document.getElementById("easy").style.background = "transparent";
	});
	//Clicking footer buttons
	document.getElementById("instagram").addEventListener("click", function(){
		window.open('http://www.instagram.com/sean_bickle3', '_blank');
	});
	document.getElementById("linkedin").addEventListener("click", function(){
		window.open('http://www.linkedin.com/in/sean-bickle-6255a511b', '_blank');
	});
	
	//Game Loop
	setInterval(refresh, 1000/30);
}

function refresh(){
	//Draw patches
	for(var i = 0; i < patches.length; i++){
		patches[i].draw();
	}
	
	//Update melon score
	document.getElementById("meloncount").innerHTML = melons;
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

function initPatches(){
	//Current patch
	var index = 0;
	//Min & max bounds of time until grown
	var minTime;
	var maxTime;
	
	switch(diff){
		//Easy mode
		case(0):
			minTime = 20;
			maxTime = 60;
			break;
		//Medium mode
		case(1):
			minTime = 10;
			maxTime = 30;
			break;
		//Hard mode
		case(2):
			minTime = 3;
			maxTime = 15;
			break;
		//Expert mode
		case(3):
			minTime = 5184000;
			maxTime = 6912000;
			break;
	}
	
	//4 rows of patches
	for(var i = 0; i < 1200; i+=300){
		//4 columns of patches
		for(var j = 0; j < 1200; j+=300){
			//Create new patch at x=i, y=j, with randome growth time depending on diff
			patches[index] = new Patch(i, j, ranRange(minTime, maxTime));
			index++
		}
	}
}

//Determine which patch was clicked
function patchClick(e){
	//Set mouse x & y
	var rectCnv = cnv.getBoundingClientRect()
	var mousex = e.clientX - rectCnv.left;
	var mousey = e.clientY - rectCnv.top;
	
	//For all patches
	for(var i = 0; i < patches.length; i++){
		//Determine which was clicked
		if((patches[i].x <= mousex && patches[i].x + patches[i].w >= mousex) && (patches[i].y <= mousey && patches[i].y + patches[i].w >= mousey)){
			//Apply tool to that patch
			patches[i].modify(tool);
			//Stop searching for clicked patch
			break;
		}
	}
}

//Reset time for all patches to grow one melon
function updateAllPatchTimes(diff){
	//Min & max bounds of time until grown
	var minTime;
	var maxTime;
	
	switch(diff){
		//Easy mode
		case(0):
			minTime = 20;
			maxTime = 60;
			break;
		//Medium mode
		case(1):
			minTime = 10;
			maxTime = 30;
			break;
		//Hard mode
		case(2):
			minTime = 3;
			maxTime = 15;
			break;
		//Farmer mode
		case(3):
			minTime = 1296000;
			maxTime = 1728000;
			break;
	}
	//Update all patches with their new vals
	for(var i = 0; i < patches.length; i++){
		patches[i].timeToGrow = ranRange(minTime, maxTime);
	}
} 
