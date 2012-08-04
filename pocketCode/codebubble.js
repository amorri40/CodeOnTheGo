/* Global variables */
window._bubble_newline_index=2; //which category to select when an element of this type is selected
window._bubble_variable_index=4;
window._bubble_string_index=4;
window._bubble_keyword_index=1;

/* check which browser */
var agent = navigator.userAgent;
var isIphone = ((agent.indexOf('iPhone') != -1) || (agent.indexOf('iPod') != -1)) ;

/*get the data from a webpage*/
function loadPage(name,el) {
	$(el).load(name);
}

/* iPhone Manually polling the selected index function for iphone Thanks to InvisibleBacon on StackOverflow */
$.fn.quickChange = function(handler) {
    return this.each(function() {
        var self = this;
        self.qcindex = self.selectedIndex;
        var interval;
        function handleChange() {
            if (self.selectedIndex != self.qcindex) {
                self.qcindex = self.selectedIndex;
                handler.apply(self);
            }
        }
        $(self).focus(function() {
            interval = setInterval(handleChange, 100);
        }).blur(function() { window.clearInterval(interval); })
        .change(handleChange); //also wire the change event in case the interval technique isn't supported (chrome on android)
    });
};

//scroll to element script
(function($) {
	  $.fn.goTo = function() {
		  //var scrollX = window.pageXOffset; var scrollY = window.pageYOffset;
if (isIphone) {
		  if (window.orientation == 0) { //portrait
		  var left=$(this).offset().left-70;
		  if (left<0) left=0;
		     window.scrollTo(left,$(this).offset().top-130); //set portrait scroll
		  }
		  else {
			  window.scrollTo($(this).offset().left-70,$(this).offset().top-85); //set landscape scroll
			  }
} //end if iphone
else {
	//don't scroll
	}
		  return this; // for chaining...
	  }
  })(jQuery);
  
/* load the statements page initially */
$(document).ready(function() {
	loadPage("./SyntaxBlocks/python/statements.html", document.getElementById('tooltippanel'));
	   $("#syntaxcategory").quickChange(function() { 
	   loadPage(this.options[this.selectedIndex].value, document.getElementById('tooltippanel'));
	   });  
});


/*create code bubble used on page load*/
function createCodeBubble() {
  /*new tooltip script*/
  $('.cm-variable').click(function(e) {
	  clickBubbleForElement(this,"VAR",window._bubble_variable_index);
  });
	  
$('.newline').click(function(e) {
	   clickBubbleForElement(this,"Line",window._bubble_newline_index);
	});	
	
$('.cm-string').click(function(e) {
	   clickBubbleForElement(this,"String",window._bubble_string_index);
	});
$('.cm-number').click(function(e) {
	   clickBubbleForElement(this,"Number",window._bubble_string_index);
	});
	
$('.cm-keyword').click(function(e) {
	   clickBubbleForElement(this,"Statement",window._bubble_keyword_index);
	});
	
$('.cm-operator').click(function(e) {
	   clickBubbleForElement(this,"Operator",window._bubble_keyword_index);
	});
	
	$('.cm-builtin').click(function(e) {
	   clickBubbleForElement(this,"Function",window._bubble_keyword_index);
	});
	
	$('.cm-comment').click(function(e) {
	   clickBubbleForElement(this,"Comment",window._bubble_keyword_index);
	});
	
  
} //end createCodeBubble

function clickBubbleForElement(el,type,catindex) {
	  window._bubble_current=el;
	  window._bubble_current_type=type;
	 
	  $("#syntaxcategory")[0].options[4].text="Edit "+type;
	  $("#syntaxcategory")[0].selectedIndex=4;//catindex;
	  loadPage($("#syntaxcategory")[0].options[4].value, document.getElementById('tooltippanel'));
	  showBubble(el);
	}

function showBubble(el) {
	
	var left=$(el).offset().left-70;
	var arrowLeft="70px";
	if (left<0) {arrowLeft=$(el).offset().left+"px"; left=0; } //it is right at the left edge of the screen
	$('.bubble').css('left', left );
	
	var top = $(el).offset().top-135
	
	
	  
	$('.bubble').css('display','block'); //make it visible
	  $('.triangle').css('left', arrowLeft ); //draw the arrow
	  
	  if(top<0) { //show the bubble under the syntax element
		  $('.triangle').css('border-color','transparent transparent rgba(230, 230, 230, 0.8) transparent'); //north arrow
	      $('.triangle').css('top', '-20px');
		  top=$(el).offset().top+25;
	  }
	  else { //show the bubble above
		  $('.triangle').css('border-color','rgba(230, 230, 230, 0.8) transparent transparent transparent'); //south arrow
	      $('.triangle').css('top', '100%');
	  }
	$('.bubble').css('top', top );
	
	//finally scroll to the bubble
	$(window._bubble_current).goTo();
/*	  
//be very careful adding and deleting rules
if (window._bubble_arrow_rule===true) document.styleSheets[0].deleteRule(0); //delete the rule since it has been created
document.styleSheets[0].insertRule('span.bubble:after { content: ""; position: absolute; width: 0;height: 0; border-width: 10px; border-style: solid; border-color: rgba(230, 230, 230, 0.5) transparent transparent transparent; top: 100%; left: '+arrowLeft+'; }', 0);
window._bubble_arrow_rule=true;
*/

	}
	
/* InsertAfter inserts a node after another node */	
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertBefore(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

/* create a new line in python*/
function newline(inden) {
	if(inden>1) alert('indentation!');
	//create the br and line elements
	var brel = document.createElement('br');
	var el = document.createElement('line');
	
	var lineHTML="<span class='newline'>{EOL}</span>";
	if(inden>1) lineHTML="<indentation id='indentation' num='"+inden+"'>"+Array(inden).join(" ")+"</indentation>"+lineHTML;
	 
	el.innerHTML=lineHTML;
	
	insertAfter(window._bubble_current.parentNode, brel); // insert the br (newline in html) before the line element
	insertAfter(brel,el);
	
	 $(el.childNodes[0]).click(function(e) {
	   clickBubbleForElement(this,"EOL",window._bubble_newline_index);
	});	
}

function goToNextElement() {
	/*var next=window._bubble_current.nextSibling;
	if (next.className==="indentation") next = next.nextSibling
	if (next === null) { //if its null it could be at the end of the line
	    if (window._bubble_current.parentNode.nextSibling.nodeName==="BR")
		next = window._bubble_current.parentNode.nextSibling.firstChild;
		}
		if (next.nextSibling === null) { return -1;} //unknown
	$(next).click();*/
	$(getNext(window._bubble_current)).click();
} //end goToNextElement

function getNext(el,child) {
	var next;
	if (child) next=el; //if its a line we pass in the first child
	else next=el.nextSibling;
	if (next === null) return getNext(el.parentNode.nextSibling,false);
	if (next.className==="indentation") return getNext(next,false);
	if (next.nodeName==="BR") return getNext(next,false);
	if (next.nodeName==="LINE") return getNext(next.firstChild,true);
	
	console.log(next.nodeName+" class:"+next.className);
	return next;
	}