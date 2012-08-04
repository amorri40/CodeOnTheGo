/*get the data from a webpage*/
function loadPage(name,el) {
	var returndata;
$.get(name, function(data){
el.innerHTML=data;
});
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