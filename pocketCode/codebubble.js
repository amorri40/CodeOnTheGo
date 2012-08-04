/* Global variables */
window._bubble_newline_index=2; //which category to select when an element of this type is selected
window._bubble_variable_index=4;

/*get the data from a webpage*/
function loadPage(name,el) {
	$(el).load(name);
}

/* Manually polling the selected index function for iphone Thanks to InvisibleBacon on StackOverflow */
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
		  
		  var scrollX = window.pageXOffset; var scrollY = window.pageYOffset;
		  if (window.orientation == 0) { //portrait
		     window.scrollTo($(this).offset().left-70,$(this).offset().top-130); //set portrait scroll
		  }
		  else {
			  window.scrollTo($(this).offset().left-70,$(this).offset().top-85); //set landscape scroll
			  }
		  return this; // for chaining...
	  }
  })(jQuery);
  
/* load the statements page initially */
$(document).ready(function() {loadPage("./SyntaxBlocks/python/statements.html", document.getElementById('tooltippanel'));
	   $("#syntaxcategory").quickChange(function() { 
	   loadPage(this.options[this.selectedIndex].value, document.getElementById('tooltippanel'));
	   });  
});


function createCodeBubble() {
  /*new tooltip script*/
  $('.cm-variable').mouseover(function(e) {
	  clickBubbleForElement(this,"VAR",window._bubble_variable_index);
  });
	  
$('.newline').click(function(e) {
	   clickBubbleForElement(this,"EOL",window._bubble_newline_index);
	});	  
} //end createCodeBubble

function clickBubbleForElement(el,type,catindex) {
	  window._bubble_current=el;
	  window._bubble_current_type=type;
	  $("#syntaxcategory")[0].selectedIndex=catindex;
	  showBubble(el);
	}

function showBubble(el) {
	$('.bubble').css('top', $(el).offset().top-135 );
	  $('.bubble').css('left', $(el).offset().left-70 );
	  $('.bubble').css('display','block');
	  $('.span.bubble:after').css('left', $(el).offset().left);
	}
	
/* InsertAfter inserts a node after another node */	
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertBefore(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode);
}