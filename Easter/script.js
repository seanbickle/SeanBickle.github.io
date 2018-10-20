//Global vars
var score = 0;
var dist = 0;
var scoreObj;
var ch;
var dir = "left";
var flr;
var msg;
var closeObj;
var locObj;
//Starting Location
var initLon;
var initLat;
//Current location
var lat;
var lon;
var address;
//Move speed
var spd = 1;

window.onload = function(){
	//Document Objects
	scoreObj = document.getElementById("score");
	ch = document.getElementById("char");
	flr = document.getElementById("floor");
	msgObj = document.getElementById("msg");
	closeObj = document.getElementById("msg_close");
	locObj = document.getElementById("location");	
	tchCtrl = document.getElementById("tch_ctrl");
	linkedinBtn = document.getElementById("linkedin");
	instagramBtn = document.getElementById("instagram");
	
	//Event listeners
	document.addEventListener('keydown', keymove);
	tchCtrl.addEventListener('click', walk);
	document.addEventListener('keyup', stopMove);
	closeObj.addEventListener('click', closeMsg);
	locObj.addEventListener('click', openMaps);
	linkedinBtn.addEventListener('click', function(){window.open("https://www.linkedin.com/in/sean-bickle-6255a511b");})
	instagramBtn.addEventListener('click', function(){window.open("https://www.instagram.com/sean_bickle3");})
	
	//Get local storage data
	if(localStorage.getItem('appData') != null){
		var appData = JSON.parse(localStorage.getItem('appData'));
		console.log(appData);
		score = appData[0];
		lat = appData[1];
		lon = appData[2];
		initLat = appData[3];
		initLon = appData[4];
		
		//Set score text
		scoreObj.innerHTML = score + " steps";
		//Set location text
		getReverseGeocodingData(lat,lon);
	}else{
		score = 0;
		initLocation();
	}
}

//Save score on window close
window.onunload = function(){
	var appData = [score, lat, lon, initLat, initLon];
	localStorage.setItem('appData', JSON.stringify(appData));
}

function keymove(e){
	//If arrows or A/D pressed
	if((e.keyCode == 39 || e.keyCode == "68") && dir != "right"){
		walk();
	}else if((e.keyCode == 37 || e.keyCode == "65") && dir != "left"){
		walk();
	}
}

function walk(){
	if(dir != "right"){
		ch.style.backgroundImage = "url('res/right.png')";
		dir = "right";
	}else{
		ch.style.backgroundImage = "url('res/left.png')";
		dir = "left";
	}
	
	//Update score and respective location
	updateScore(spd);
	//Update floor offset
	updateDist();
	setTimeout(function(){ch.style.backgroundImage = "url('res/default.png')"}, 100);
}

function stopMove(){
	ch.style.backgroundImage = "url('res/default.png')";
}

function updateScore(spd){
	score += spd;
	scoreObj.innerHTML = score + " steps";
	lon = initLon + (score * 0.000009);
	getReverseGeocodingData(lat,lon);
}

function closeMsg(){
	document.body.removeChild(msgObj);
}

function openMaps(){
	//Open google maps window with start and end points
	window.open("https://www.google.com/maps/dir/" + initLat + "," + initLon + "/" + lat + "," + lon);
}

function updateDist(){
	if(dist != -100) dist -= 2;
	else dist = 0;
	
	flr.style.left = dist + "%";
}

function initLocation(){
	navigator.geolocation.getCurrentPosition(setPos);
}

function setPos(pos){
	initLat = lat = pos.coords.latitude;
	initLon = lon = pos.coords.longitude;
	//Convert lon lat to location
	getReverseGeocodingData(lat,lon);
	console.log(initLat, initLon);
}

function getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    // Make Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        // Check if the Geocode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
            address = (results[0].formatted_address);
			locObj.innerHTML = address;
        }
    });
}