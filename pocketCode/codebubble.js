/* Global variables */
window._bubble_newline_index=0; //which category to select when an element of this type is selected
window._bubble_variable_index=4;
window._bubble_string_index=4;
window._bubble_keyword_index=0;
window._bubble_expression_index=1;
window._bubble_variable_index=3;

/* check which browser */
var agent = navigator.userAgent;
var isIphone = ((agent.indexOf('iPhone') != -1) || (agent.indexOf('iPod') != -1)) ;

/*get the data from a webpage*/
function loadPage(name,el) {
	$(el).load(name);
}

/*

   Functions

*/

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
	loadPage($("#syntaxcategory")[0].options[0].value, document.getElementById('tooltippanel')); //load the initial statements panel
	   $("#syntaxcategory").quickChange(function() { 
	   loadPage(this.options[this.selectedIndex].value, document.getElementById('tooltippanel'));
	   });  
});


/*
 Create code bubble used on page load
*/
function createCodeBubble() {
    $('#output').delegate('.cm-variable','click',(function(e) {
	  clickBubbleForElement(this,"Variable",-1);
    }));
	
    $('#output').delegate('.newline', 'click', function() { 
	clickBubbleForElement(this,"Line",-1/*window._bubble_newline_index*/); 
	});	
	
    $('#output').delegate('.cm-string','click',(function(e) {
	   clickBubbleForElement(this,"String",-1);
	}));
    $('#output').delegate('.cm-number','click',(function(e) {
	   clickBubbleForElement(this,"Number",-1);
	}));
	
    $('#output').delegate('.cm-keyword','click',(function(e) {
	   clickBubbleForElement(this,"Statement",-1);
	}));
	
    $('#output').delegate('.cm-operator','click',(function(e) {
	   clickBubbleForElement(this,"Operator:"+this.innerHTML,-1);
	}));
	
	$('#output').delegate('.cm-builtin','click',(function(e) {
	   clickBubbleForElement(this,"Function",-1);
	}));
	
	$('#output').delegate('.cm-comment','click',(function(e) {
	   clickBubbleForElement(this,"Comment",-1);
	}));
	
	$('#output').delegate('.cm-delimiter','click',(function(e) {
	   clickBubbleForElement(this,"Delimiter",-1);
	}));
	
	$('#output').delegate('.unknown-expression','click',(function(e) {
	   clickBubbleForElement(this,"Unknown expression",window._bubble_expression_index);
	}));
	
	$('#output').delegate('.unknown-variable','click',(function(e) {
	   clickBubbleForElement(this,"Unknown expression",window._bubble_variable_index);
	}));
	
  
} //end createCodeBubble

function clickBubbleForElement(el,type,catindex) {
	  window._bubble_current=el;
	  window._bubble_current_type=type;
	 
	  $("#syntaxcategory")[0].options[4].text="Edit "+type;
	  if (catindex===-1) {catindex=4;}
	  $("#syntaxcategory")[0].selectedIndex=catindex;
	  loadPage($("#syntaxcategory")[0].options[catindex].value, document.getElementById('tooltippanel'));
	  showBubble(el);
	}

function showBubble(el) {
	
	var left=$(el).offset().left-70;
	var arrowLeft="65px"; //triangle starts from base (so we want moddible point touching
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

	}
	
/* InsertAfter inserts a node after another node */	
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertBefore(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

/*
Moving the code bubble functions
*/
function goToElement(el) { //move the bubble to a certain element
	$(el).click();
}

function goToNextElement() {
	$(getNext(window._bubble_current)).click();
} //end goToNextElement

function goToPreviousElement() {
	$(getPrevious(window._bubble_current)).click();
} //end goToNextElement

function getNext(el,child) {
	var next;
	if (child) next=el; //if its a line we pass in the first child
	else next=el.nextSibling;
	if (next === null) return getNext(el.parentNode,false);
	if (next.className==="indentation") return getNext(next,false);
	if (next.nodeName==="BR") return getNext(next,false); //ignore the br tag
	if (next.nodeName==="LINE") return getNext(next.firstChild,true);
	if (next.nodeName==="STATEMENT") return getNext(next.firstChild,true);
	if (next.style.display==='none') return getNext(next,false); //ignore hidden elements
	
	console.log(next.nodeName+" class:"+next.className);
	return next;
	}
	
function getPrevious(el,child) {
	var prev;
	if (child) prev=el; //if its a line we pass in the first child
	else prev=el.previousSibling;
	if (prev === null) return getPrevious(el.parentNode,false);
	if (prev.className==="indentation") return getPrevious(prev,false);
	if (prev.nodeName==="BR") return getPrevious(prev,false);
	if (prev.nodeName==="LINE") return getPrevious(prev.lastChild,true);
	if (prev.nodeName==="STATEMENT") return getPrevious(prev.lastChild,true);
	if (prev.style.display==='none') return getPrev(prev,false); //ignore hidden elements
	
	console.log(prev.nodeName+" class:"+prev.className);
	return prev;
	}
/* 
end moving code bubble functions
*/
	
/* 
 * Convenience functions for editing 
*/	

/* create a new line in the editor*/
function newline(inden) {
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
	
function createSpan(type,html) {
	var span = document.createElement("span");
	  span.className=type;
	  span.innerHTML=html;
	  return span;
}

function insertBeforeCurrent(el) {
	insertBefore(window._bubble_current,el);
}

function insertAfterCurrent(el) {
	insertAfter(window._bubble_current,el);
}

function delete_current() {
	var currentNode=window._bubble_current; //keep the current node because we are about to change
	goToPreviousElement(); //change to previous element (since it won't move, unlike the next element)
	currentNode.parentNode.removeChild(currentNode);
}

function is_blank_line(el) { //returns whether thenode is a blank line
	if (el.tagName==="STATEMENT") el=el.parentNode;
	if (el.tagName!="LINE") return false; //not even a line
	if (el.childNodes.length===1) return true; //only has a newline element so yes it is blank
	for (nodenum in el.childNodes) {
		var node=el.childNodes[nodenum];
		if (node.tagName!="BR" && node.tagName!="INDENTATION") return false; //its not blank as it contains non indentation nodes
	}
}

/* 
Funtions for modifying the codebubble UI
*/
function python_optionbox_action(el) {
	window._bubble_insert_position=el.getAttribute('insert_position');
	 window[el.options[el.selectedIndex].value](); //call the functionname stored in the value of each option
	   el.selectedIndex=0;
}

/* 
Statement functions 
*/

/* insert_statement creates the elements only if it is an EOL (statements can't be used as expressions)*/
function insert_statement(statementType,statementHTML,selectChild) {
	var statementelement = document.createElement("statement");
	statementelement.className=statementType;
	statementelement.innerHTML=statementHTML;
	insertBefore(window._bubble_current,statementelement);
	if (selectChild!=-1) { //select one of the child nodes (normally used for unknown expressions added by the statement
		$(statementelement.childNodes[selectChild]).click();	
	}
}

function statement_newline() {
	if (window._bubble_current.parentNode.firstChild.tagName==="INDENTATION") {console.log(window._bubble_current.parentNode.firstChild);}
	newline();
	goToNextElement();
	}


/*
 * Operator Expressions
 */
function python_operator_expression(operator,place) {
	var span = createSpan('cm-operator',operator);
	if (place==='after') insertAfterCurrent(span); //can put operator before or after current expression
	else insertBeforeCurrent(span);
	var unknown_exp=createSpan('unknown-expression','???'); 
	insertAfter(span,unknown_exp);
	goToElement(unknown_exp); //move to the unknown expression
}

function python_comma_expression() {
	python_operator_expression(', ',window._bubble_insert_position);
}	

function python_addition_expression() {
	 python_operator_expression(' + ',window._bubble_insert_position);
}

function python_subtraction_expression() {
	 python_operator_expression(' - ',window._bubble_insert_position);
}

function python_multiplication_expression() {
	 python_operator_expression(' * ',window._bubble_insert_position);
}

function python_division_expression() {
	 python_operator_expression(' / ',window._bubble_insert_position);
}

function python_remainder_expression() {
	 python_operator_expression(' % ',window._bubble_insert_position);
}

function python_truncating_division_expression() {
	 python_operator_expression(' // ',window._bubble_insert_position);
}

function python_power_expression() {
	 python_operator_expression(' ** ',window._bubble_insert_position);
}

function python_bitwise_or_expression() {
	 python_operator_expression(' | ',window._bubble_insert_position);
}

function python_bitwise_xor_expression() {
	 python_operator_expression(' ^ ',window._bubble_insert_position);
}

function python_bitwise_and_expression() {
	 python_operator_expression(' & ',window._bubble_insert_position);
}

function python_bitwise_not_expression() {
	 python_operator_expression(' ~',window._bubble_insert_position);
}

function python_left_shift_expression() {
	 python_operator_expression(' << ',window._bubble_insert_position);
}

function python_right_shift_expression() {
	 python_operator_expression(' >> ',window._bubble_insert_position);
}

/*
 Comparison operators
*/
 function python_equality_expression() {
	 python_operator_expression(' == ',window._bubble_insert_position);
}
function python_inequality_expression() {
	 python_operator_expression(' != ',window._bubble_insert_position);
}
function python_less_than_expression() {
	 python_operator_expression(' < ',window._bubble_insert_position);
}
function python_less_than_equal_expression() {
	 python_operator_expression(' <= ',window._bubble_insert_position);
}
function python_greater_than_expression() {
	 python_operator_expression(' > ',window._bubble_insert_position);
}
function python_greater_than_equal_expression() {
	 python_operator_expression(' >= ',window._bubble_insert_position);
}
function python_identity_test_expression() {
	 python_operator_expression(' is ',window._bubble_insert_position);
}
function python_not_identity_test_expression() {
	 python_operator_expression(' is not ',window._bubble_insert_position);
}
function python_membership_test_expression() {
	 python_operator_expression(' in ',window._bubble_insert_position);
}
function python_not_membership_test_expression() {
	 python_operator_expression(' not in ',window._bubble_insert_position);
}


/*
 * Expression Functions
*/
function insert_expression(expressionType,html) {
	//if unkown expression replace otherwise insertafter
	if (window._bubble_current.className==="unknown-expression" || window._bubble_current.className==="unknown-variable") {window._bubble_current.className=expressionType; window._bubble_current.innerHTML=html;}
	else {
	  var span = document.createElement("span");
	  span.className=expressionType;
	  span.innerHTML=html;
	  insertAfter(window._bubble_current,span);
	}
	goToNextElement();//finnaly move along to select the next element
}

function exp_add_string() {
  var value=prompt("Enter a string","");
  insert_expression('cm-string','"'+value+'"'); 
}

function exp_add_integer() {
  var value=prompt("Enter an integer","");
  insert_expression('cm-number',value); 	
}

function exp_add_float() {
  var value=prompt("Enter a floating point value","");
  insert_expression('cm-number',value); 	
}

function exp_add_long() {
  var value=prompt("Enter a long value","");
  insert_expression('cm-number',value); 	
}

function exp_add_complex() {
  var value=prompt("Enter a complex number","");
  insert_expression('cm-number',value); 	
}

function exp_goto_variable_bubble() {
	 var catindex=window._bubble_variable_index; //goto the variable screen
	 $("#syntaxcategory")[0].selectedIndex=catindex;
	 loadPage($("#syntaxcategory")[0].options[catindex].value, document.getElementById('tooltippanel'));
}

function exp_wrap_parentheses() {
	var left = createSpan('cm-operator',' ( ');
	insertBeforeCurrent(left);
	var right = createSpan('cm-operator',' ) ');
	insertAfterCurrent(right);
	goToElement(window._bubble_current); //since the element has moved move the bubble too
}