//GLOBAL VARIABLES
//HTML tool container
var tools_cont;
var tools_height;
//Array of HTML tool objects
var tools = [];
//Toolbar minimiser object
var minbar;
//JS patch objects
var patches = [];
//HTML soil objects
var soil = [];
//Audio clips
var audio = [];
//Score
var score = 0;
//Current tool
var tool = -1;
//difficulty
var diff = 0;
//Boundary of possible times for growth transition
var growBounds = [10,20];

//SOIL PATCH CLASS
class Patch{
	constructor(t){
		//Growth stage (grass, soil, seeds etc.)
		this.stage = 0;
		//Time seeds were updated
		this.lastUpdate = 0;
		//Time taken for patch to increase growth
		this.updateTime = t;
	}
}

window.onload = function(){
	//DOCUMENT ELEMENTS
	diff_btn = document.getElementById("diff");
	minbar = document.getElementById("min_bar");
	tools_cont = document.getElementById("tools_cont");
	tools_height = tools_cont.style.height;
	tools = document.getElementsByClassName("tools");
	soil = document.getElementsByClassName("soil");
	audio = [new Audio("res/sound/select.wav"), new Audio("res/sound/water.wav")];

	//EVENT LISTENERS
	//Social Media Buttons
	document.getElementById("linkedin").addEventListener("click", function(){ window.open("https://www.linkedin.com/in/sean-bickle-6255a511b")});
	document.getElementById("instagram").addEventListener("click", function(){ window.open("https://www.instagram.com/sean_bickle3")});
	//Key presses
	document.addEventListener("keydown", keypress)
	//Difficulty Button
	diff_btn.addEventListener("click", changeDiff);
	//Tools Minimise Bar
	minbar.addEventListener("click", minTools);
	//Tool Buttons
	for(var i = 0; i < tools.length; i++) tools[i].addEventListener("click", selectTool);
	//Soil Patches
	for(var i = 0; i < soil.length; i++) soil[i].addEventListener("click", useTool);
	//for(var i = 0; i < soil.length; i++) soil[i].addEventListener("mousemove", useTool);

	//Fill Patches Array
	initPatches();

	//Game Loop
	setInterval(updatePatches, 1000/30);
}

//Return random val between minVal and maxVal
function ranRange(minVal, maxVal){
	return Math.floor(Math.random() * (maxVal - minVal)) + minVal;
}

//Create array of patches
function initPatches(){
	//Create array of patches of length matching number of patches on page
	for(var i = 0; i < soil.length; i++){
		//Init patch with time to grow as random time between bounds
		patches.push(new Patch(ranRange(growBounds[0],growBounds[1])));
	}
}

//Update patch graphic + state
function updatePatches(){
	//Time of update
	var currentTime = Math.trunc(performance.now() / 1000);

	for(var i = 0; i < patches.length; i++){
		var timePassed = currentTime - patches[i].lastUpdate;

		//Check if patch is due update
		if(timePassed > patches[i].updateTime){
			if(patches[i].stage == 1){ //Regrow grass if left unplanted
				patches[i].stage = 0;
				patches[i].lastUpdate = currentTime;
				soil[i].style.border = "3px solid rgb(104,205,104)";
			} else if(patches[i].stage == 2){ //Crow attack if left unwatered
				++patches[i].stage;
				patches[i].lastUpdate = currentTime;
			} else if(patches[i].stage == 3){ //Crow disappears over time
				patches[i].stage = 1;
				patches[i].lastUpdate = currentTime;
			}else if((patches[i].stage >= 4 && patches[i].stage < 8) && currentTime != patches[i].lastUpdate){ //Grow melon
				++patches[i].stage;
				patches[i].lastUpdate = currentTime;
			}

			//Update graphic
			redraw(i);
		}
	}
}

//Redraw background of patch i
function redraw(i){
	soil[i].style.backgroundImage = "url('res/stage" + patches[i].stage + ".png')";
}

//Change difficulty setting
function changeDiff(){
	var labels = ["EASY", "HARD", "FARMER"];
	//Increment difficulty
	if(++diff == 3) diff = 0;
	//Update difficulty indicator
	this.innerHTML = labels[diff];

	//Change patch "time to grow" boundaries
	if(diff == 0) growBounds = [10,20];
	else if(diff == 1) growBounds = [2,8];
	else if(diff == 2) growBounds = [1728000,2304000];

	//Update all patch times to be within new growth boundary
	for(var i = 0; i < patches.length; i++) patches[i].updateTime = ranRange(growBounds[0], growBounds[1]);
}

//Hide / Show Toolbar
function minTools(){
	if(tools_cont.style.height != "20px"){
		tools_height = tools_cont.style.height;
		tools_cont.style.height = "20px";
		minbar.innerHTML = "show tools";
	}else{
		tools_cont.style.height = tools_height;
		minbar.innerHTML = "hide tools";
	}
}

//Use toolbar tools to select functionality
function selectTool(){
	//Clear last button style
	for(var i = 0; i < tools.length; i++){
		tools[i].style.backgroundColor = "transparent";
		tools[i].style.textDecoration = "none";
	}
	//Update current button style
	this.style.backgroundColor = "rgb(40,40,40)";
	this.style.textDecoration = "underline";

	//Update Tool
	tool = this.dataset.id;

	//Update cursor icon
	if(tool < 4) for(var i = 0; i < soil.length; i++) soil[i].style.cursor = "url(res/cursor" + tool + ".png), auto";
}

//Use keys to select tools
function keypress(e){
	if(e.keyCode > 48 && e.keyCode < 53){
		tool = e.keyCode - 49;
		for(var i = 0; i < soil.length; i++) soil[i].style.cursor = "url(res/cursor" + tool + ".png), auto";
	}
}

//Perform tool action on patch
function useTool(){
	//Selected patch
	var p = this.dataset.id;

	if(patches[p].stage == 0 && tool == 0){ //Spade on grass
		//Update patch border to soil
		this.style.border = "3px solid rgb(134, 98, 53)";
		//Increase patch stage
		patches[p].stage = 1;
		//Refresh time of last update
		patches[p].lastUpdate = Math.trunc(performance.now() / 1000);
	} else if(patches[p].stage == 1 && tool == 1){ //Seeds on soil
		patches[p].stage = 2;
		patches[p].lastUpdate = Math.trunc(performance.now() / 1000);
	} else if(patches[p].stage == 2 && tool == 2){ //Can on seeds
		patches[p].stage = 4;
		patches[p].lastUpdate = Math.trunc(performance.now() / 1000);
	} else if(patches[p].stage >= 7 && tool == 3){ //Clippers on melon
		harvestMelon(p, patches[p].stage > 7);
	}

	redraw(p);
}

//Remove melon + update tool
function harvestMelon(p, dead){
	//Update score
	if(dead) --score;
	else{
		//Point for melon harvested and growing melon
		for(var i = 0; i < patches.length; i++){
			if(patches[i].stage >= 4 && patches[i].stage != 8) ++score;
		}
	}

	//Update visual Score
	document.getElementById("melon_count").innerHTML = score;
	//Reset patch
	patches[p].stage = 1;
	patches[p].lastUpdate = Math.trunc(performance.now() / 1000);
	patches[p].updateTime = ranRange(growBounds[0], growBounds[1]);
}

function play(sound){
	sound.currentTime = 0;
	sound.play();
}
