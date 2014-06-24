/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var canvas; // holds the canvas element
var ctx; // holds the context
var vizFunc; // holds the current function to use to draw on the canvas
var rnaLoaded = false; // boolean, true if a structure has been loaded

function initCanvas() {
    canvas = document.getElementById('theCanvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    } else
        document.writeln("<p>ho</p>");
}

var drawDotPlot = function(scaleFactor) {
   // how many pixels between each base in RNA chain. I made this number up!
    var xscale;
    var yscale;
    var dy = 10;
    var dx = 10; // how many pixels between each base in RNA chain. I made this number up!
    // how many pixels between each base in RNA chain. I made this number up!
    if (scaleFactor === "auto") // Kimmer commented out this block since we're not using scale
        xscale = 900/(rnaStruct.length+3)/dx;
    else 
        xscale = scaleFactor;
    yscale = 600/900*xscale; 
   // xscale = 1; // note that some of the variables in the rest of this function still refer
        // to xscale or yscale, so set it equal to one to be safe
    //yscale = 1;
    ctx.scale(xscale,yscale); // Kimmer will comment this out since we're not using it
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.font = "bold 12px Arial";
    ctx.strokeStyle = "rgb(200,0,0)";
    ctx.lineWidth = 1;
    
    // Karen, draw the line only once, so before the for loop
    ctx.beginPath();
    
ctx.lineTo(2*dx,40);
ctx.lineTo((rnaStruct.length + 1)*dx,40);
//ctx.lineTo(10,40);
//ctx.lineTo(680,40);
ctx.fillStyle = "black";
ctx.font = "bold 20px Arial";
//ctx.fillText("rnaStruct", 14, 39);
//put text on line has to be 1 about the line start. 
// 	context.fillText(text,x,y,maxWidth);
ctx.stroke();
ctx.closePath();
     // draw vertical line
ctx.beginPath();
//ctx.lineTo(2*dx,680);
//ctx.lineTo((rnaStruct.length + 1)*dx,960);
ctx.lineTo(680,40);
ctx.lineTo(680,960);
ctx.stroke();
ctx.closePath();
    
    var xpos = dx; // move along the horizontal axis starting 15 pixels from the left edge
    var yval = 40/yscale; // This is the vertical position we're moving along. Close to the
    // Karen, look at yval, it's going to be equal to 680 but our canvas is only 600 pixels
    // tall. Anything drawn below at y coord of yval will not show up!
        
    // rnaStruct holds the RNA chain for now. It's basically an array where each entry
    //    is 3 items: 
    //      0) an index which starts counting from 1
    //      1) the letter for the RNA base at this position 
    //      2) the index of the other RNA base it's paired with, or 0 if it's not paired
    for (var i = 0; i < rnaStruct.length - 1; i++) { // kimmer, fix the -1 !!
        xpos = xpos + dx; 
        ctx.fillText(rnaStruct[i][1], xpos, yval); // draw the base
        if ((i+1) % 5 === 0) {

            ctx.font = "bold 10px Arial";
            ctx.fillText(i+1,xpos,yval + 10); // this is like tick marks , so draw a number every 
                // 5th one (the i % 5)
            ctx.font = "bold 12px Arial";
        }
        var b1 = parseInt(rnaStruct[i][0]) - 1;
        var b2 = parseInt(rnaStruct[i][2]) - 1;
        ctx.beginPath();
        ctx.arc(xpos + dx/3 + cirRad,yval-15,cirRad,0.,Math.PI,false);
        
        //ctx.rotate(Math.PI/2);
        ctx.stroke();
        ctx.closePath();
      
// we've subtracted off a 1, so b2 is -1 if this
            // base is not paired with anything, and otherwise rnaStruct[b2] is the base we're
            // paired with
        if (b1 < b2) { 
            ctx.beginPath();
          ctx.arc(dx* b2 +dx/2,yval,cirRad,0.,Math.PI,false);
            ctx.stroke();
            ctx.closePath();
// the b1 < b2 just checks that we're only looking ahead in the chain
                // if b2 != -1 but b2 < b1, then we've already looped over base b1 and don't need
                // to draw the same circle twice
            var cirRad = (b2 - b1)*dx/2; // Karen, this is for the big arc in the
            //  the linear visualization. You need a smaller circle radius
            // here I calculate the radius of a circle where every
          //ctx.arc(x,y,r,c,rnaStruct);
    // tick is dx pixels wide
            //ctx.closePath(); // duh, lift the pen!
        }
    }
    
    ctx.closePath();
};

var drawLinearDiagram = function(scaleFactor) {
    var xcale;
    var yscale;
    var dx = 15; // how many pixels between each base in RNA chain. I made this number up!
    if (scaleFactor === "auto")
        xscale = 1080/(rnaStruct.length+3)/dx;
    else 
        xscale = scaleFactor;
    yscale = 640/1080*xscale;
    ctx.scale(xscale,yscale);
    ctx.fillStyle = "rgb(200,0,0)";
    ctx.font = "bold 12px Arial";
    ctx.strokeStyle = "rgb(200,0,0)";
    ctx.lineWidth = 1;
    
    var xpos = dx; // move along the horizontal axis starting 15 pixels from the left edge
    var yval = 680/yscale; // This is the vertical position we're moving along. Close to the
        // bottom of the canvas element. Smaller yval closer to zero would be moving along
        // a horizontal line closer to the top of the canvas
        
    // rnaStruct holds the RNA chain for now. It's basically an array where each entry
    //    is 3 items: 
    //      0) an index which starts counting from 1
    //      1) the letter for the RNA base at this position 
    //      2) the index of the other RNA base it's paired with, or 0 if it's not paired
    for (var i = 0; i < rnaStruct.length - 1; i++) { // kimmer, fix the -1 !!
        xpos = xpos + dx; 
        ctx.fillText(rnaStruct[i][1], xpos, yval); // draw the base
        if ((i+1) % 5 === 0) {
            ctx.font = "bold 10px Arial";
            ctx.fillText(i+1,xpos,yval + 15); // this is like tick marks , so draw a number every 
                // 5th one (the i % 5)
            ctx.font = "bold 12px Arial";
        }
        var b1 = parseInt(rnaStruct[i][0]) - 1; // b1 should always be equal to i, because it was
            // an index starting at 1, and we've subtracted off that 1
        var b2 = parseInt(rnaStruct[i][2]) - 1; // we've subtracted off a 1, so b2 is -1 if this
            // base is not paired with anything, and otherwise rnaStruct[b2] is the base we're
            // paired with
        if (b1 < b2) { // the b1 < b2 just checks that we're only looking ahead in the chain
                // if b2 != -1 but b2 < b1, then we've already looped over base b1 and don't need
                // to draw the same circle twice
            var cirRad = (b2 - b1)*dx/2; // here I calculate the radius of a circle where every
                // tick is dx pixels wide
            ctx.beginPath();
            ctx.arc(xpos + dx/3 + cirRad,yval-15,cirRad,0.,Math.PI,true);
            ctx.stroke();
            ctx.closePath(); // duh, lift the pen!
        } 
    }
    ctx.closePath();
};

var drawCircularDiagram = function(scaleFactor) {
    //var span = document.createElement('span');
    //span.innerHTML = '<p>';
    var xcale;
    var yscale;
    var dtheta = 2*Math.PI/(rnaStruct.length + 3);
    if (scaleFactor === "auto")
        xscale = 1; //1080/(rnaStruct.length+3)/dx;
    else 
        xscale = 1;//scaleFactor;
    yscale = 1; //640/1080*xscale;
    ctx.scale(xscale,yscale);
    ctx.fillStyle = "rgb(0,0,200)";
    ctx.font = "bold 12px Arial";
    ctx.strokeStyle = "rgb(0,0,200)";
    ctx.lineWidth = 1;
    
    var xpos, ypos;
    var xc = 1080/2;
    var yc = 720/2;
    ctx.save();
    ctx.translate(xc,yc);
    var r = 300, dr = 15;
    var theta = 0;
    var first = true;
    for (var i = 0; i < rnaStruct.length - 1; i++) { // fix the -1 !!
        theta = theta + dtheta;
        //ctx.beginPath();
        var x1 = Math.cos(theta);
        var y1 = Math.sin(theta);
        ctx.fillText(rnaStruct[i][1], x1*(r+dr), y1*(r+dr));
        if ((i+1) % 5 === 0) {
            ctx.font = "bold 10px Arial";
            ctx.fillText(i+1,x1*(r+2*dr), y1*(r+2*dr));
            ctx.font = "bold 12px Arial";
        }
        //ctx.closePath();
        var b1 = parseInt(rnaStruct[i][0]);
        var b2 = parseInt(rnaStruct[i][2]);
        if (b1 < b2) {
            //first = false;
            //var t1 = b1*dtheta;
            var t2 = b2*dtheta;
            var t3 = (theta+t2)/2;
            var newx, newy, x2, y2;
            var x2 = Math.cos(t2);
            var y2 = Math.sin(t2);
            newx = -Math.sin(t3);
            newy = Math.cos(t3);
            var m1, m2, b2, b2, x3, y3;
            m1 = (newy - y1)/(newx - x1);
            m2 = (y2+newy)/(x2+newx);
            b1 = y1-m1*x1;
            b2 = y2-m2*x2;
            //ctx.fillText('x1',x1*r,y1*r);
            //ctx.fillText('x2',x2*r,y2*r);
            //ctx.fillText('xp',newx*r,newy*r);
            //ctx.fillText('xm',-newx*r,-newy*r);
            ctx.beginPath();
            //ctx.moveTo(-newx,newy);
            //ctx.lineTo(newx,-newy);
            //ctx.moveTo(x1*r,y1*r);
            var xp, yp;
            xp = (b2-b1)/(m1-m2);
            yp = m1*xp + b1;
            //ctx.fillText('x*',xp*r,yp*r);
            ctx.strokeStyle = "rgb(200,0,0)";
            //ctx.lineTo(xp*r, yp*r);
            //ctx.lineTo(x2*r,y2*r);
            //ctx.closePath();
            //ctx.beginPath();
            //ctx.moveTo(x1*r,y1*r);
            //ctx.strokeStyle = "rgb(200,0,0)";
            //ctx.lineTo(x2*r,y2*r);
            m1 = -1/m1;
            m2 = -1/m2;
            b1 = (y1+yp)/2 - m1*(x1+xp)/2;
            b2 = (y2+yp)/2 - m2*(x2+xp)/2;
            var cx, cy, arcR;
            cx = (b2-b1)/(m1-m2);
            cy = m1*cx + b1;
            arcR = Math.sqrt((x1-cx)*(x1-cx) + (y1-cy)*(y1-cy));
            if (x1 > cx)
                t3 = Math.asin((y1-cy)/arcR);
            else {
                if (y1 > cy)
                    t3 = Math.acos((x1-cx)/arcR);
                else {
                    t3 =  Math.acos((x1-cx)/arcR);
                    t3 = 2*Math.PI - t3;
                }
            }
            if (x2 > cx)
                t2 = Math.asin((y2-cy)/arcR);
            else {
                if (y2 > cy)
                    t2 = Math.acos((x2-cx)/arcR);
                else {
                    t2 =  Math.acos((x2-cx)/arcR);
                    t2 = 2*Math.PI - t2;
                }
            }
            //ctx.beginPath();
            if (t3 > 0 && t3 < t2 && t2-t3 < Math.PI) {
                ctx.arc((r+dr)*cx,(r+dr)*cy,(r+dr)*arcR,t3,t2);
                    //ctx.arc(r*cx,r*cy,r*arcR,0,2*Math.PI);
            } else {
                ctx.arc((r+dr)*cx,(r+dr)*cy,(r+dr)*arcR,t2,t3);
            }
                //ctx.arc(r*cx,r*cy,r*arcR,0,2*Math.PI);
            //ctx.arc(0,0,100,0,-3*Math.PI/2);
            //ctx.fillText('C',r*cx,r*cy);
            ctx.stroke();
            ctx.closePath();
            //ctx.beginPath();
            
            //ctx.arc(xpos + dx/3 + cirRad,yval-15,cirRad,0.,Math.PI,true);
            //ctx.stroke();
            //ctx.closePath(); // duh, lift the pen!
        } 
        //span.innerHTML = span.innerHTML + '<br>' + i + ' ' + rnaStruct[i][1] + ' ' + b1 + ' ' + b2;
    }
    ctx.closePath();
    //span.innerHTML = span.innerHTML + '</p>';
    
    //document.getElementById('list').insertBefore(span, null);
};

function initThings() {
    rnaLoaded = false;
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    initCanvas();
    $(function() {
        $( "#vizMethod" ).buttonset();
    });
    vizFunc = drawDotPlot;
    $( "#vizMethod" ).hide();
    $( " #circle, #line, #dotplot" ).change(
        function () {
            if ($("#circle").attr("checked")) {
                vizFunc = drawCircularDiagram;
            }
            if ($("#line").attr("checked")) {
                vizFunc = drawLinearDiagram;
            }
            if ($("#dotplot").attr("checked")) {
                vizFunc = drawDotPlot;
            }
            if (rnaLoaded) // if an RNA structure is loaded, re-draw the canvas
                vizFunc("auto");
        }
    );
}
