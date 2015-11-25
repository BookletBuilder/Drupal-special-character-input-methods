// 
// Keyboard Toolbar
// 
// <div class="mytoolbar">
//   <div class="content"></div>
//   <script class="button-template" type="text/x-template">
//     <span title="@REPLACE">@DISPLAY</span>
//   </script>
//   <script class="data" type="text/javascript">
//     kbChars = [{"title":"Upper case","characters":["\u00c1","A\u019e","C\u0304","\u010a","\u00c9","\u0120","\u1e22","\u00cd","I\u019e","K\u0304","K\u0307","\u00d3","P\u0304","\u1e56","\u1e60","T\u0304","\u1e6a","\u00da","U\u019e"]},{"title":"Lower case","characters":["\u00e1","a\u019e","c\u0304","\u010b","\u00e9","\u0121","\u1e23","\u00ed","i\u019e","k\u0304","k\u0307","\u00f3","p\u0304","\u1e57","\u1e61","t\u0304","\u1e6b","\u00fa","u\u019e"]}];
//   </script>
// </div>
//

function kbToolbar(selector, data) {
  
  jQuery(function($){

    var kbLastFocused = undefined;
    var kbLastFocusedRange = undefined;
    
    function _detectDocumentSelection() {
    
      //console.log(document.selection);  
      return typeof document.selection !== 'undefined';
    
    }    
    function _prepareContentSelector() {
      
      return selector + ' .widget';
      
    }
    function _prepareButtonGroupTemplateSelector() {
      
      return selector + ' .group-template';
      
    }
    function _prepareButtonTemplateSelector() {
      
      return selector + ' .button-template';
      
    }
    function _prepareButtonSelector() {
      
      return _prepareContentSelector() + ' .button';
      
    }
    function _getTemplate(selector) {
      
      
      return $($(selector).html());
      
    }
    function _getSelectionStart(element) {
      
      // Modified
      // Author: Diego Perini <dperini@nwbox.com>
      // http://javascript.nwbox.com/cursor_position/
    
      if (_detectDocumentSelection() && element.createTextRange) {
        
        var range = document.selection.createRange().duplicate();
        range.moveEnd('character', element.value.length);
        
        if (range.text == '') {
          
          return element.value.length;
        
        }
        else {
          
          return element.value.lastIndexOf(range.text);
        
        }
      }
      else {
        
        return element.selectionStart;
      
      }
      
    }
    function _getSelectionEnd(element) {

      // Modified      
      // Author: Diego Perini <dperini@nwbox.com>
      // http://javascript.nwbox.com/cursor_position/
      
      if (_detectDocumentSelection() && element.createTextRange) {
        
        var range = document.selection.createRange().duplicate();
        range.moveStart('character', -element.value.length);
        return range.text.length;
      
      } else {
        
        return element.selectionEnd;
      
      }

    }
    function _getTextBeforeSelection() {
      
      var a = '';
      var startIndex = _getSelectionStart(kbLastFocused);
      a = (startIndex > 0)
        ? kbLastFocused.value.substring(0, startIndex).replace(/ /g, '\xa0') || '\xa0'
        : ''
        ;
        
      return a;
      
    }
    function _getTextAfterSelection() {
      
      var b = '';
      var endIndex = _getSelectionEnd(kbLastFocused);
      var endOfString = kbLastFocused.value.length;
      b = (endIndex < endOfString)
        ? kbLastFocused.value.substring(endIndex, endOfString).replace(/ /g, '\xa0') || '\xa0'
        : ''
        ;

      return b;
      
    }
    function _setCursorPosition (element, position) {
      
      // Modified from: http://stackoverflow.com/questions/512528/set-cursor-position-in-html-textbox
      if (element.createTextRange) {
        var range = element.createTextRange();
        range.move('character', position);
        range.select();
      }
      else {
        element.focus();
        if (element.setSelectionRange) {
          element.setSelectionRange(position, position);
        }
      }
      
    }
    
    function buildToolbar() {

      for (buttonGroupIndex in data) {
        var toolbarGroup = data[buttonGroupIndex];
        
        // Get button group template
        var buttonGroupTemplate = _getTemplate(_prepareButtonGroupTemplateSelector());
        
        for (charIndex in toolbarGroup['characters']) {
          var ch = toolbarGroup['characters'][charIndex];
  
          // Prepare button for toolbar
          var buttonTemplate = _getTemplate(_prepareButtonTemplateSelector());
          $(buttonTemplate).attr('title', ch);
          $(buttonTemplate).html(ch);
          
          // Place button in group
          $(buttonGroupTemplate).append(buttonTemplate);
          
        }
        
        // Place button group in toolbar
        $(_prepareContentSelector()).append(buttonGroupTemplate);
        
      }
      
    }
    function rememberLastFocused() {

      // Remember the most recent text input field that was given focus
      $('textarea,input[type="text"]').focus(function() {
        
        kbLastFocused = this;
        
      });
      
    }
    function rememberLastFocusedRange() {

      // For IE: Cache the "selection" for the text input fields, when a range of text is selected
      var kbCacheEvents = ['keypress', 'keyup', 'keydown', 'click', 'mousedown', 'mouseup'];
      for (var cacheEventIndex in kbCacheEvents) {
        var eventName = kbCacheEvents[cacheEventIndex];
        
        $('textarea,input[type="text"]').bind(eventName, function(){
          if (document.selection) {
            
            // Cache the selection
            kbLastFocusedRange = document.selection.createRange().duplicate();
            
          }
        });
        
      }
      
    }
    function handleToolbarButtonClicks() {
  
      $(_prepareButtonSelector()).click(function(){
        
        var insertThis = $(this).attr('title');
        
        var insertionPointFound = kbLastFocused != undefined;
        if (insertionPointFound) {
          if (_detectDocumentSelection()) {
            
            kbLastFocusedRange.text = insertThis;
            
          }
          else {
            
            // Prepare new text string
            var a = _getTextBeforeSelection();
            var b = _getTextAfterSelection();
            var text = a + insertThis + b;
            
            // Assign new string
            kbLastFocused.value = text;
            
            // Set new cursor position
            _setCursorPosition(kbLastFocused, a.length + insertThis.length);
  
          }
        }
        else {
          // No fields were focused previously
        }
        
      });
      
    }
    
    buildToolbar();
    rememberLastFocused();
    rememberLastFocusedRange();
    handleToolbarButtonClicks();

  });
  
}  

