class Patch{
	constructor(x, y, timeToGrow){
		//Position
		this.x = x;
		this.y = y;
		//Dimensions 
		this.h = 300;
		this.w = 300;
		//Background
		this.b = "rgb(144, 108, 63)";
		//Growth stage - 0 = mud; 1 = seeds; 2 = small melon etc.
		this.stage = -1;
		//Image holder
		this.img = new Image();
		//Last valid update time
		this.lastUpdate = 0;
		//Time until next growth stage reached
		this.timeToGrow = timeToGrow;
		//Check if soil has been watered
		this.watered = false;
	}
	
	draw(){
		//update plant if seeds planted & soil watered
		if(this.stage > 0 && this.watered){
			this.update();
		}
		
		//Change soil colour depending on watered or not
		if(this.watered){
			this.b = "rgb(114, 78, 33)";
		}else{
			this.b = "rgb(144, 108, 63)";
		}
		
		//Draw soil colour
		drawRect(this.x, this.y, this.h, this.w, this.b);
		
		//Check if seeds have been planted
		if(this.stage > 0){
			this.img.src = "res/model" + this.stage + ".png";
			ctx.drawImage(this.img,this.x,this.y);
		}
		
		//Apply stroke
		ctx.strokeStyle = "rgb(134, 98, 53)";
		ctx.lineWidth = 5;
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
	
	update(){
		//Get seconds that have passed
		var currentTime = Math.trunc(performance.now() / 1000);
		if(this.lastUpdate != currentTime && (currentTime - this.lastUpdate) % this.timeToGrow == 0 && this.stage < 5){
			//Increment stage
			++this.stage;
			//Update when last update was
			this.lastUpdate = currentTime;
		}
	}
	
	modify(tool){
		//Seeds used
		if(tool == 1 && this.stage < 1){
			this.lastUpdate = Math.trunc(performance.now() / 1000);
			this.stage = 1;
		}
		
		//Clippers used
		if(tool == 2 && this.stage == 4){
			//Set score based on how many other melons are active
			var score = 0;
			for(var i = 0; i < patches.length; i++){
				if(patches[i].stage > 0) ++score;
			}
			melons += score;
			//Reset patch
			this.watered = false;
			this.stage = 0;
			this.updatePatchTime();
		}
		if(tool == 2 && this.stage == 5){
			this.watered = false;
			this.stage = 0;
			this.updatePatchTime();
			--melons;
		}
		
		//Watering can used
		if(tool == 3 && this.stage > 0){
			this.watered = true;
		}
	}
	
	updatePatchTime(){
		//Min & max bounds of time until grown
		var minTime;
		var maxTime;
	
		switch(diff){
			//Easy mode
			case(0):
				minTime = 20;
				maxTime = 40;
				break;
			//Medium mode
			case(1):
				minTime = 10;
				maxTime = 20;
				break;
			//Hard mode
			case(2):
				minTime = 3;
				maxTime = 10;
				break;
			//Expert mode
			case(3):
				minTime = 5184000;
				maxTime = 6912000;
				break;
		}
		this.timeToGrow = ranRange(minTime, maxTime);
	}
}
