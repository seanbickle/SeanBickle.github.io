var cnv;
var ctx;
var numInner = 0;
var numTotal = 0;
var resultField;
var iterations = 0;


window.onload = function(){
    //Canvas objs
	cnv = document.getElementById("cnv");
    ctx = cnv.getContext("2d");

    //Get result field
    resultField = document.getElementById("result");

    //Listen for resize + set cnv size
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    //Draw background
    rect(0, 0, cnv.width, cnv.height, "#f2f2f2");
    //Draw circle border
    circ_stroke(cnv.height/2, cnv.height/2, cnv.height/2 - 2, "rgb(0,0,255)", 2);

    //refresh canvas
    setInterval(refresh, 1);
}

function reset(){
    //Check if target iterations is less than points already plotted - saves time plotting these again
    if(iterations <= numTotal){
        //Draw background
        rect(0, 0, cnv.width, cnv.height, "#f2f2f2");
        //Draw circle border
        circ_stroke(cnv.height/2, cnv.height/2, cnv.height/2 - 2, "rgb(0,0,255)", 2);

        //Reset calc calues
        numInner = 0;
        numTotal = 0;
    }
}

function refresh(){
    if(iterations != 0 && numTotal != iterations){
        //generate point
        var px = ranRange(0, cnv.width);
        var py = ranRange(0, cnv.height);

        //Plot point
        plotPoint(px, py);

        //Calc new estimate
        resultField.innerText = "iteration " + numTotal + ": " + 4 * (numInner / numTotal);
    }
}

function plotPoint(px, py){
    //Increment total number of points plotted
    numTotal++;

    //Check if plot is inside circle; change colour depending on this
    if(Math.pow(px - (cnv.width / 2), 2) + Math.pow(py - (cnv.height / 2), 2) < Math.pow(cnv.height / 2, 2)){
        circ_fill(px, py, 5, "rgb(0,0,255,0.3");
        numInner++;
    }else{
        circ_fill(px, py, 5, "rgb(255,0,0,0.3");
    }
}

function calculate(){
    //Get the user's target iterations
    var temp_input = document.getElementById("it_input").value

    //Check if input is valid
    if(temp_input > 0){
        //Set the new iterations goal
        iterations = temp_input;
        //Reset canvas
        reset();
    }
}

function home(){
	window.location = "../index.html"
}

//Generate random int between range
function ranRange(minVal, maxVal){
	return Math.floor(Math.random() * (maxVal - minVal)) + minVal;
}

function circ_fill(x, y, r, c){
    ctx.fillStyle = c;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
}

function circ_stroke(x, y, r, c, lw){
    ctx.strokeStyle = c;
    ctx.beginPath();
    ctx.lineWidth = lw
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();
}

function rect(x, y, w, h, c){
	ctx.fillStyle = c;
	ctx.fillRect(x, y, w, h);
	ctx.closePath();
}

function resizeCanvas(){
    var cont = document.getElementById('container');

	cnv.height = cont.offsetWidth;
    cnv.width = cont.offsetWidth;

    //Draw circle border
    circ_stroke(cnv.height/2, cnv.height/2, cnv.height/2 - 2, "rgb(0,0,255)", 2);
}
