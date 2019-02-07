var boxwidth = 30.0;
var boxheight = 30.0;
var canvassize = 600;
var boxlist = [];
var gridsize = 6; //Rows and columns of boxes
var boxspace = boxwidth / 100 * 180; //Distance between boxes in percentages of box width
var gridedgedist = 5; //Distance from first row and column to edge of canvas measured in box widths.
var backgroundsong;

var mousevector;

function preload() {
//backgroundsong = loadSound('assets/Peaceful_Journey.mp3');
}

function setup() {
    createCanvas(600, 600); //window.innerHeight
    
    //backgroundsong.play()
    
    var colorlist = [[255, 178, 102], [178, 255, 102], [178, 102, 255], 
                     [255, 102, 178], [102, 255, 178], [102, 178, 255], 
                     [255, 178, 178], [178, 255, 178], [178, 178, 255], 
                     [255, 102, 102], [102, 255, 102]];
        
    for (var x=0; x<gridsize; x++) {
        for (var y=0; y<gridsize; y++){
            tempbox = new Box (
                new p5.Vector(gridedgedist*boxwidth + boxspace*x, 
                              gridedgedist*boxheight + boxspace*y), 
                new p5.Vector(gridedgedist*boxwidth + boxspace*x, 
                              gridedgedist*boxheight + boxspace*y), 
                colorlist[Math.floor(Math.random() * colorlist.length)]);
            boxlist.push(tempbox);
        }
    }
}

function draw() {
    background('white');
    
    mousevector = new p5.Vector(mouseX, mouseY); 
    	
    for (var i=0; i<boxlist.length; i++){
        boxlist[i].measure();
        boxlist[i].update();
        boxlist[i].drawhome();
    }for (var i=0; i<boxlist.length; i++){
        boxlist[i].draw();
    }
}

function mouseClicked () {
    for (var i=0; i<boxlist.length; i++) {
        var tempvec = p5.Vector.sub(boxlist[i].fixedPoint, mousevector);
        if (tempvec.mag() < boxwidth/2*1.1) {
            boxlist[i].hasbeenclicked = 1;
            break;
        }
    }
}


function Box(pos, fxp, homecolor) {
    this.pos = pos; //Position of the box
    this.fixedPoint = fxp; //Position of its home point
    this.fxpvec; //Vector from box to its home point
    this.homecolor = color (homecolor[0], homecolor[1], homecolor[2]);
    this.hasbeenclicked = 0;
    
    this.mousevec; //Vector from mousevector to box pos
    this.mouseeffectlimit = 80; //Distance at which mouse affects box
    
    this.dimension = new p5.Vector(boxwidth, boxheight); //Box size
    this.strokecolor = 0; //Color of box border (0=white, 255 = black)
    
    this.measure = function () {
        this.fxpvec = new p5.Vector.sub(this.fixedPoint, this.pos);
        this.mousevec = new p5.Vector.sub(this.pos, mousevector);
    }
    
    this.update = function () {
        var movevec = new p5.Vector(0, 0); //Movement vector for this update
        
        //attract to home
        movevec = movevec.add(this.fxpvec.setMag(this.fxpvec.mag() * 0.07));
        //check if it should be repelled or if it has been clicked
        if (this.fxpvec.mag() < 1 && this.hasbeenclicked == 1){
        } else {
            //repel from mouse
            if (this.mousevec.mag() < this.mouseeffectlimit) {
            //factor is normalized, and greater the closer the mouse is to the box
            var factor =  (this.mouseeffectlimit - this.mousevec.mag()) / this.mouseeffectlimit;
            //factor = sqrt(factor);
            movevec = movevec.add(this.mousevec.setMag(this.mousevec.mag() * factor * 1));
            }
        }
        
        this.pos.add(movevec);
    }
    
    this.draw = function () {   //Calculate color of the border according to distance
        if (this.fxpvec.mag() > 5) {
            this.strokecolor = 255;
        } else if (this.fxpvec.mag() < 1) {
            this.strokecolor = 0;
        } else {
            this.strokecolor = this.fxpvec.mag() * 51;
        }
        strokeWeight(1);
        stroke(255 - this.strokecolor);
        fill('white');
        var sizeadjust = this.fxpvec.mag() * 2; //Constant sets size
        rect(this.pos.x - (this.dimension.x + sizeadjust)/2, 
             this.pos.y - (this.dimension.y + sizeadjust)/2, 
             this.dimension.x + sizeadjust, 
             this.dimension.y + sizeadjust);
    }
    
    this.drawhome = function () {
        if (this.hasbeenclicked === 1) {
            for (i=0; i < this.homecolor.levels.length - 1; i++){
                if (this.homecolor.levels[i] < 255) {
                    this.homecolor.levels[i] += 1;
                }
            }
        }
        strokeWeight(0);
        fill(this.homecolor);
        rect(this.fixedPoint.x - this.dimension.x/2, 
             this.fixedPoint.y - this.dimension.y/2, 
             this.dimension.x, 
             this.dimension.y);
    }
    
    this.drawshade = function () {   
        var shadedist = 1.1; //Bigger shadedist puts shadows further from boxes
        var shadecolor = 180; // self explanatory
        strokeWeight(0);
        fill(color(shadecolor, shadecolor, shadecolor));
        var shadevec = new p5.Vector(0, 0);
        shadevec = this.fxpvec.setMag(this.fxpvec.mag() * shadedist);
        rect(this.pos.x + shadevec.x, this.pos.y + shadevec.y, this.dimension.x, this.dimension.y);
    }
}