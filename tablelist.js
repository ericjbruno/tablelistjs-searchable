// 
// This code turns an HTML table into scrollable list with multiple columns
//

var selected = null;
var initComplete = null;

window.onload=function(){
    initTableJS();
    tableHighlightRow();
}

function initTableJS() {
    initComplete = true;

    // Look for input box and insert key handler
    var prevTxt = null;
    var txt = document.getElementsByName('filterTxt');
    if ( txt != null ) {
        for (var i = 0; i < txt.length; i++) {
            txt[i].onkeyup=function(event) {
                var e = event || window.event;
                var curTxt = e.target.value;
                handleKeyPress(prevTxt,curTxt);
                prevTxt = curTxt;
                return true;
            }
        }
    }
}

//
// This function highlights a table row as the mouse hovers
// over it. It also adds code to mark a row as selected when 
// clicked on and toggle it when selected again
//
function tableHighlightRow() {
  // Make sure the table has been initiaized, where key-press handlers
  // are set for each row, to filter list content
  //
  if ( initComplete != true ) {
      initTableJS();
  }

    if (document.getElementById && document.createTextNode) {
    var tables=document.getElementsByTagName('table');
    for ( var i=0; i<tables.length; i++ ) {
      if ( tables[i].className==='TableListJS' ) {
        var trs=tables[i].getElementsByTagName('tr');
        for ( var j=0; j<trs.length; j++) {
          if (trs[j].parentNode.nodeName==='TBODY') {
            trs[j].onmouseover=function(){
                // 'highlight' color is set in tablelist.css
                if ( this.className === '') {
                    this.className='highlight';
                }
                return false
            }
            trs[j].onmouseout=function(){
                if ( this.className === 'highlight') {
                    this.className='';
                }
                return false
            }
            trs[j].onmousedown=function(){
                //
                // Toggle the selected state of this row
                // 

                // 'clicked' color is set in tablelist.css.
                if ( this.className !== 'clicked' ) {
                    // Clear previous selection
                    if ( selected !== null ) {
                        selected.className='';
                    }

                    // Mark this row as selected
                    this.className='clicked';
                    selected = this;
                }
                else {
                    this.className='';
                    selected = null;
                }

                return true
            }
          }
        }
      }
    }
  }
}

//
// key presses are handled to use the text as a search within the
// table list
//
function handleKeyPress(oldVal, newVal) {
    var select = document.getElementById('entries');

    // If the number of characters in the text box is less than last time
    // it must be because the user pressed delete
    if ( oldVal !== null && (newVal.length < oldVal.length) ) {
        // Restore the lists original set of entries 
        // and start from the beginning
        for ( i = 1; i < select.rows.length; i++ ) {
            select.rows[i].style.display = '';
        }
    }

    // Break out all of the parts of the search text by splitting 
    // on white space
    var parts = newVal.split(' ');

    // Interate through each row and filter out the entries that 
    // don't contain the entered text
    for ( i = 1; i < select.rows.length; i++ ) {
        var entry = select.rows[i];
        if ( entry.style.display === 'none' ) {
            continue;
        }
        var rowMatch = true;

        // Compare each part of the entered text to each cell's text
        for ( p = 0; p < parts.length; p++ ) {
            // The row needs to contain all portions of the
            // search string *but* in any order
            var part = parts[p].toUpperCase();
            var partMatch = false;
            if ( part !== ' ' && part !== '' ) { // don't search on space or null
                // Iterate through each column (cell) per row 
                for ( c = 0; c < entry.cells.length; c++ ) {
                    var entryTxt = entry.cells[c].innerHTML;
                    if ( entryTxt.toUpperCase().lastIndexOf(part) >= 0 ) {
                        partMatch = true;
                        break;
                    }
                }

                if ( partMatch === false ) {
                    // Cycled through all cells and didn't find
                    // a match for this part, so this row needs
                    // to be deleted
                    rowMatch = false;
                    break;
                }
            }
        }

        if ( rowMatch === false ) {
            select.rows[i].style.display = 'none';
        }
    }
}

