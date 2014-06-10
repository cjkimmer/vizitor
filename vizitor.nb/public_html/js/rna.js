/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var rnaStruct = []; // This is the array that holds [index,base,pairedWith] information for chain

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
                console.log(rnaStruct);
                //span.innerHTML = span.innerHTML + '</p>';
                //document.getElementById('list').insertBefore(span, null);
                rnaLoaded = true;
                $( "#vizMethod" ).show();
                vizFunc("auto"); // this calls whichever function vizFunc is equal to
            };
        })(f);
        
        reader.readAsText(f);
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}



