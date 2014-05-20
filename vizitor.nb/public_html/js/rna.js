/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var rnaStruct = [];

/**
 * 
 */
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var output = [];
    for (var i = 0; i < files.length; i++) {
        f = files[i];
        output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
            '</li>');
        var reader = new FileReader();
        
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
            return function(e) {
                //var span = document.createElement('span');
                //span.innerHTML = '<p>';
                ls = e.target.result.split('\n');
                for (i = 1; i < ls.length; i++) {
                    //span.innerHTML = span.innerHTML + '<br>' + ls[i];
                    rnaStruct.push(ls[i].split(' '));
                }
                //span.innerHTML = span.innerHTML + '</p>';
                //document.getElementById('list').insertBefore(span, null);
                //drawLinearDiagram("auto");
                drawCircularDiagram("auto");
            };
        })(f);
        
        reader.readAsText(f);
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

var canvas;
var ctx;

function initCanvas() {
    canvas = document.getElementById('theCanvas');
    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    } else
        document.writeln("<p>ho</p>");
}

function drawLinearDiagram(scaleFactor) {
    //var span = document.createElement('span');
    //span.innerHTML = '<p>';
    var xcale;
    var yscale;
    var dx = 15;
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
    
    var xpos = dx;
    var yval = 680/yscale;
    for (var i = 0; i < rnaStruct.length - 1; i++) { // fix the -1 !!
        xpos = xpos + dx;
        //ctx.beginPath();
        ctx.fillText(rnaStruct[i][1], xpos, yval);
        if ((i+1) % 5 === 0) {
            ctx.font = "bold 10px Arial";
            ctx.fillText(i+1,xpos,yval + 15);
            ctx.font = "bold 12px Arial";
        }
        //ctx.closePath();
        var b1 = parseInt(rnaStruct[i][0]) - 1;
        var b2 = parseInt(rnaStruct[i][2]) - 1;
        if (b1 < b2) {
            var cirRad = (b2 - b1)*dx/2;
            ctx.beginPath();
            ctx.arc(xpos + dx/3 + cirRad,yval-15,cirRad,0.,Math.PI,true);
            ctx.stroke();
            ctx.closePath(); // duh, lift the pen!
        } 
        //span.innerHTML = span.innerHTML + '<br>' + i + ' ' + rnaStruct[i][1] + ' ' + b1 + ' ' + b2;
    }
    ctx.closePath();
    //span.innerHTML = span.innerHTML + '</p>';
    //document.getElementById('list').insertBefore(span, null);
}

function drawCircularDiagram(scaleFactor) {
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
}

function initThings() {
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    initCanvas();
}

