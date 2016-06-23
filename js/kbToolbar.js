// 
// Keyboard Toolbar
// 
// <div class="mytoolbar">
//   <div class="content"></div>
//   <script class="tool-character-group-template" type="text/x-template">
//     ...
//   </script>
//   <script class="tool-character-group-character-template" type="text/x-template">
//     ...
//   </script>
//   <script class="data" type="text/javascript">
//     kbChars = [
//       {
//         "type":"Characters",
//         "characters":[
//           "\u00c1","A\u019e","C\u0304"
//         ]
//       },
//       {
//         "type":"Divider"
//       },
//       {
//         "type":"LineBreak"
//       }
//    ];
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
    function _prepareCharacterGroupTemplateSelector() {
      
      return selector + ' .tool-character-group-template';
      
    }
    function _prepareCharacterTemplateSelector() {
      
      return selector + ' .tool-character-group-character-template';
      
    }
    function _prepareCharacterSelector() {
      
      return _prepareContentSelector() + ' .character';
      
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

      var parent = $(_prepareContentSelector());

      for (toolIndex in data) {

        var tool = data[toolIndex];
        tool.type = 'type' in tool ? tool.type : 'CharacterGroup';
        tool.content = '';

        switch(tool.type) {

          case 'CharacterGroup':
            buildToolContent_CharacterGroup(tool);
            break;

          case 'Divider':
            buildToolContent_Divider(tool);
            break;

          case 'LineBreak':
            buildToolContent_LineBreak(tool);
            break;

          default:
            break;

        }

        parent.append(tool.content);

      }

      function buildToolContent_CharacterGroup(tool) {

        // Get character group template
        var characterGroupTemplate = _getTemplate(_prepareCharacterGroupTemplateSelector());

        for (charIndex in tool['characters']) {

          var ch = tool['characters'][charIndex];
          var ch_show = null;
          var ch_insert = null;
          var ch_classes = null;
          if (typeof ch === 'string') {

            ch_show = ch;
            ch_insert = ch;
            ch_classes = [];

          }
          else {

            ch_show = ch.show;
            ch_insert = ch.insert;

            ch_classes = 'classes' in ch 
                       ? ch.classes 
                       : []
                       ;

          }

          // Prepare character for character group
          var characterTemplate = _getTemplate(_prepareCharacterTemplateSelector());
          $(characterTemplate).attr('title', ch_show);
          $(characterTemplate).attr('insert', ch_insert);
          for (classIndex in ch_classes) {

            $(characterTemplate).addClass(ch_classes[classIndex]);

          }
          $(characterTemplate).html(ch_show);

          // Place character in group
          $(characterGroupTemplate).append(characterTemplate);

        } // end-for
        
        // Add classes
        if ('classes' in tool) {

          $(characterGroupTemplate).addClass(tool.classes.join(' '));

        }
        else {
          // pass
        }

        tool.content = characterGroupTemplate;

      }
      function buildToolContent_Divider(tool) {

        tool.content = '<span class="divider"></span>';

      }
      function buildToolContent_LineBreak(tool) {

        tool.content = '<br />';

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
    function toolbarCharacterGroupCharacter__handleClick() {
  
      $(_prepareCharacterSelector()).click(function(){
        
        var insertThis = $(this).attr('insert');
        
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

    toolbarCharacterGroupCharacter__handleClick();

  });
  
}  

