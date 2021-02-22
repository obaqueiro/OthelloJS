
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");



ratio= 50;

// the map of the othello game

path = ["--------",
		"--------",
		"--------",
		"--------",
		"--------",
		"--------",
		"--------",
		"--------",
         ];



function Vector(x , y)
{
	this.x = x;
	this.y = y;
}
	
direction = new Vector(1 ,0);
Vector.prototype.plus = function(other) {
return  new  Vector(this.x + other.x, this.y + other.y);
};

function Grid(width, height){
	this.space = new Array(width*height);
	this.width = width;
	this.height = height;

} 
Grid.prototype.set = function(vector , value)
{	
	return this.space [ vector.x + vector.y * this.width] = value;
};

Grid.prototype.get = function( vector )
{
	return this.space [ vector.x + vector.y * this.width ];
};	

whiteArray = [new white(new Vector(3,3)),new white(new Vector(4,4))]
console.log(whiteArray[0]);
function white(vector)
{
	this.vector = vector;
	this.originChar = "0";
}
blackArray = [new black(new Vector(3,4)),new black(new Vector(4,3))]
function black(vector)
{
	this.vector = vector;
	this.originChar = "X";
}

function elementFromChar(legend , ch)
{
	if(ch == "-")
	{
		return "-";
	}
	else{
	var element = new legend[ch]();
	element.originChar = ch;	
	return element;
	}
}

var grid;

function empty(){

}

function World(worldMap, legend, whArray, blArray)
{

	grid = new Grid(worldMap[0].length, worldMap.length);
	this.grid = grid;
	this.legend = legend;
	worldMap.forEach(function(line , y){
		for(var x = 0; x < line.length ; x++){
			grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
		}
	});

	for(var i =0; i<whArray.length ;i++){
		grid.set(whArray[i].vector, whArray[i] );
	}
	//console.log(1);

	
	for(var i =0;i<blArray.length;i++){
		grid.set(blArray[i].vector , blArray[i] );
	}		



}
var world;
World.prototype.toString = function(){
	var output = "";
	ctx.beginPath();
				ctx.rect(0,0, 500, 500);
				ctx.fillStyle = "#000000";
				ctx.fill();
	ctx.closePath();
	for(var y =0;y< this.grid.height; y++){
		for(var x =0;x<this.grid.width; x++){
			var  element = grid.get(new  Vector(x, y));
			//console.log(element);
			output  +=  charFromElement(element);	
			//console.log(charFromElement(element));
			if(charFromElement(element)==="0")
			{	ctx.beginPath();
				ctx.rect(x*(ratio+1), y*(ratio+1), ratio, ratio);
				ctx.fillStyle = "#008B8B";
				ctx.fill();
				ctx.closePath();
			}
			//console.log("1<----", output);
			else if(charFromElement(element)==="X")
			{	
				ctx.beginPath();
				ctx.rect(x*(ratio+1), y*(ratio+1), ratio, ratio);
				ctx.fillStyle = "#17202a";
				ctx.fill();
				ctx.closePath();
				}
			else{
				ctx.beginPath();
				ctx.rect(x*(ratio+1), y*(ratio+1), ratio, ratio);
				ctx.fillStyle = "#ffff";
				ctx.fill();
				ctx.closePath();
			
			}
		}
		output += "\n";
	}
	return output;
};


function charFromElement(element)
{
	if(element == "-")
	{
		return "-";
	}
	else
	{
		return element.originChar;
	}
}

canvas.onclick =  function(e){
		var x =0;
		var y =0;
		 x = Math.floor(e.clientX/52 -1.25);
		 y = Math.floor((e.clientY-30)/50 );
		console.log(1);
		if(x>=0 & x<8 &y>=0 & y<8 ){
			console.log(x, y);

			if(isPossible(x, y)){	
				whiteArray.push(new white(new Vector(x, y) ));
				move(x, y);
				setTimeout(moveAI, 700);
				
			}
		}
};

function isPossible(x , y){

	var dir ;
	 var k  =false;
	var m = dirChange(x, y, new Vector(1,0));	if(m==true){k = true;}
	m = dirChange(x, y, new Vector(-1,-1));		if(m==true){k = true;}
	m = dirChange(x, y, new Vector(-1,1));		if(m==true){k = true;}
	m = dirChange(x, y, new Vector(-1,0));		if(m==true){k = true;}
	m = dirChange(x, y, new Vector(0,-1));		if(m==true){k = true;}
	m = dirChange(x, y, new Vector(0,1));		if(m==true){k = true;}
	m = dirChange(x, y, new Vector(1,-1));		if(m==true){k = true;}
	m = dirChange(x, y, new Vector(1,1));		if(m==true){k = true;}
	return k;
}


function flipElements(Arr){


	for(var i=0;i<Arr.length;i++){
		for(var j=0;j<blackArray.length;j++){
			if(Arr[i].x == blackArray[j].vector.x && Arr[i].y == blackArray[j].vector.y){
				blackArray.splice(j, 1);
				whiteArray.push(new white(Arr[i]));
			}
		}
	}
}

function move(x, y){
	grid.set(new Vector(x, y), new white(new Vector(x, y)));
	world = new  World(path ,{"-": empty, "X":black, "0": white },  whiteArray, blackArray,);
	console.log(world.toString ()); 
}


world = new  World(path ,{"-": empty, "X":black, "0": white },  whiteArray, blackArray,);
console.log(world.toString ()); 
	

function dirChange(x, y, vector){
	var a = x;
	var b = y;
	var k = false;
	var flip = [];

 	while(a>=0 && b>=0 && a<8 && b<8){
 		var vv = new Vector(a,b);
		vv = vv.plus(vector);
 		if(vecinrange(vv) && charFromElement(grid.get(vv))==="X"){
			var v = new Vector(a,b);
			v = v.plus(vector) ;
			flip.push(v);
			
		}
		else{
			var vv = new Vector(a,b);
				vv = vv.plus(vector);
			if(vecinrange(vv) && charFromElement(grid.get(vv))==="0"&& flip.length>0){
		
				flipElements(flip);
				k = true;
			}
			break;
		}
		a+=vector.x;
		b+=vector.y;
 	}
 	return k;
}

function isPossibleAI(x , y){

	var dir ;
	var count = 0;
	 var k  =false;
	 var max = 0;
	 var index;

	directionArray = [new Vector(1,0), new Vector(-1,-1),new Vector(-1,1),new Vector(-1,0),new Vector(0,-1),new Vector(0,1),new Vector(1,-1),new Vector(1,1)];
	
	var m = dirChangeAI(x, y, directionArray[0]);	
	m += dirChangeAI(x, y, directionArray[1]);		
	m += dirChangeAI(x, y, directionArray[2]);		
	m += dirChangeAI(x, y, directionArray[3]);		
	m += dirChangeAI(x, y, directionArray[4]);		
	m += dirChangeAI(x, y, directionArray[5]);		
	m += dirChangeAI(x, y, directionArray[6]);		
	m += dirChangeAI(x, y, directionArray[7]);	
	return m;
}

function flipElementsAI(Arr){

	for(var i=0;i<Arr.length;i++){
		for(var j=0;j<whiteArray.length;j++){
			if(Arr[i].x == whiteArray[j].vector.x && Arr[i].y == whiteArray[j].vector.y){
				whiteArray.splice(j, 1);
				blackArray.push(new black(Arr[i]));
			}
		}
	}
}

function dirChangeAI(x, y, vector){
	var a = x;
	var b = y;
	var k = false;
	var len =0;
 	var flip = [];
 	while(a>=0 && b>=0 && a<8 && b<8){
 		var vv = new Vector(a,b);
		vv = vv.plus(vector);
		//console.log(vv);
		if(vecinrange(vv) && charFromElement(grid.get(vv))==="0"){
			var v = new Vector(a,b);
			v = v.plus(vector) ;
			flip.push(v);
			
		}
		else{
			var vv = new Vector(a,b);
			vv = vv.plus(vector);
			if(vecinrange(vv) && charFromElement(grid.get(vv))==="X"&& flip.length>0){
				len = flip.length;
			}
			break;
		}
		a+=vector.x;
		b+=vector.y;

 	}
 	return len;
}


function dirChangeAI2(x, y, vector){
	var a = x;
	var b = y;
	var k = false;
	var len =0;
 	var flip = [];
 	
 	while(a>=0 && b>=0 && a<8 && b<8){
		 		
		var vv = new Vector(a,b);
		vv = vv.plus(vector);
		if(vecinrange(vv) && charFromElement(grid.get(vv))==="0"){
			// console.log("get (", vv.x,",",vv.y ,")", charFromElement(grid.get(vv)), "<------");
			var v = new Vector(a,b);
			v = v.plus(vector) ;
			flip.push(v);
				
		}
		else{
			var vv = new Vector(a,b);
			vv = vv.plus(vector);
				
			// console.log(charFromElement(grid.get(vv)));
			if(vecinrange(vv) && charFromElement(grid.get(vv))==="X"&& flip.length>0){
				
			// console.log("get", vv, charFromElement(grid.get(vv)), "<------");
				len = flip.length;
				flipElementsAI(flip);

				
			}
			break;
		}
		a+=vector.x;
		b+=vector.y;
 	}
 	return len;
}


function makeMove(vect){
	var dir ;
	var x = vect.x;
	var y = vect.y;
	console.log("makeMove--> ", x ,y);
	var count = 0;
	 var k  =false;
	 var max = 0;
	 var index;
	 grid.set(vect, new black(vect));
	 blackArray.push(new black(vect));
	 directionArray = [new Vector(1,0), new Vector(-1,-1),new Vector(-1,1),new Vector(-1,0),new Vector(0,-1),new Vector(0,1),new Vector(1,-1),new Vector(1,1)];
	
	var m = dirChangeAI2(x, y, directionArray[0]);	
	m += dirChangeAI2(x, y, directionArray[1]);		
	m += dirChangeAI2(x, y, directionArray[2]);		
	m += dirChangeAI2(x, y, directionArray[3]);		
	m += dirChangeAI2(x, y, directionArray[4]);		
	m += dirChangeAI2(x, y, directionArray[5]);		
	m += dirChangeAI2(x, y, directionArray[6]);		
	m += dirChangeAI2(x, y, directionArray[7]);
	

		// console.log(vect, grid.get(vect), "CC--");
	return null;
}

function vecinrange(vector){
	return vector.x>=0&&vector.y>=0&&vector.x<=7&&vector.y<=7;
}




/*  the value 3, 2  is recieved which is wrong judge the value from grid.set */





function moveAI(){
	var x =0;
	var y = 0;
	var extremeCorner = false;
	var corner = false;
	
	//var d = isPossibleAI(0,0);
	if(isPossibleAI(0,0)>0 && charFromElement(grid.get(new Vector(0,0)))=="-"){
		console.log(0 , 0);
			makeMove(new Vector(0,0));
			world = new  World(path ,{"-": empty, "X":black, "0": white },  whiteArray, blackArray,);
			console.log(world.toString ());
			extremeCorner = true;	
	}
	else if(isPossibleAI(7,0)>0&& charFromElement(grid.get(new Vector(7,0)))=="-"){
			console.log(7 , 0);
			makeMove(new Vector(7 , 0));
			world = new  World(path ,{"-": empty, "X":black, "0": white },  whiteArray, blackArray,);
			console.log(world.toString ());
			extremeCorner = true;
	}

	else if(isPossibleAI(0,7)>0&& charFromElement(grid.get(new Vector(0,7)))=="-"){
			console.log(0 , 7);
			makeMove(new Vector(0 , 7));
			world = new  World(path ,{"-": empty, "X":black, "0": white },  whiteArray, blackArray,);
			console.log(world.toString ());
			extremeCorner = true;
	}

	else if(isPossibleAI(7,7)>0&& charFromElement(grid.get(new Vector(7,7)))=="-"){
		console.log(7 , 7);
			makeMove(new Vector(7 , 7));
			world = new  World(path ,{"-": empty, "X":black, "0": white },  whiteArray, blackArray,);
			console.log(world.toString ());
			extremeCorner = true;
	}
	if(!extremeCorner){
		var max = 0;
		for(var y = 1;y<7;y++){

				if(isPossibleAI(0,y)>max&& charFromElement(grid.get(new Vector(0,y)))=="-"){
						max = isPossibleAI(0,y);
						vect = new Vector(0,y); 
						corner = true;
					}
				if(isPossibleAI(7,y)>max&& charFromElement(grid.get(new Vector(7,y)))=="-"){
						max = isPosssibleAI(7,y);
						vect = new Vector(7,y);
						corner = true; 
					}
				}
				//console.log("Corner checking");
		for(var x = 1;x<7;x++){
				if(isPossibleAI(x,0)>max&& charFromElement(grid.get(new Vector(x,0)))=="-"){
						max = isPossibleAI(x,0);
						vect = new Vector(x,0);
						corner=true; 
					}
				if(isPossibleAI(x,7)>max&& charFromElement(grid.get(new Vector(x,7)))=="-"){
						console.log("this");
						max = isPossibleAI(x,7);
						vect = new Vector(x,7);
						corner = true; 
					}
				}

			if(corner){
				makeMove(vect);
				world = new  World(path ,{"-": empty, "X":black, "0": white },  whiteArray, blackArray,);
				console.log(world.toString ());
			}

	}

	if(!extremeCorner && !corner){
	
		var lowMax = 0;
		var lowVect ;
		
		for(var x=1; x<7;x++){
			
			for(var y=1; y<7;y++){
				//console.log(charFromElement(grid.get(new Vector(0,0))));
					if(isPossibleAI(x,y)>lowMax&& charFromElement(grid.get(new Vector(x,y)))=="-"){
							lowMax = isPossibleAI(x,y);
							lowVect = new Vector(x, y);
						}
			}
		}
		//console.log("non corner checking", lowVect);
		makeMove(lowVect);
				world = new  World(path ,{"-": empty, "X":black, "0": white },  whiteArray, blackArray,);
				console.log(world.toString ());

	}

	


}
