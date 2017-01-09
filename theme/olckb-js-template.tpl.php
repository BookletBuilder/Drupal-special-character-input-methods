<?php

  $path = drupal_get_path('module', 'olckb');
  drupal_add_js($path . '/js/kbToolbar.js');
  drupal_add_css($path . '/olckb.css');
  
?>

<div class="olckb-toolbar">

  <div class="widget"></div>
  
  <script class="tool-character-group-template" type="text/x-template">
    
    <span class="tool character-group"></span>
    
  </script>
  <script class="tool-character-group-character-template" type="text/x-template">
    
    <a href="#" onclick="return false" class="character" title="REPLACEMENT-TEXT">DISPLAY-TEXT</span>
    
  </script>
  <script type="text/javascript">
    
    // Provision toolbar data
    toolbarData = <?php echo json_encode($olckb_chars, JSON_UNESCAPED_UNICODE) ?>;

    // Initialize the toolbar javascript; pass in selector and toolbar data
    kbToolbar('.olckb-toolbar', toolbarData);

    // Make adjusment to Drupal toolbar to make room for character toolbar
    (function ($) {

      if (Drupal.toolbar != undefined) {
        Drupal.toolbar.height = function() {

          console.log('Drupal.toolbar.height');

          //
          // Overriding Drupal's TOOLBAR function that calculates height
          //

          // Objective: Add in the extra height needed for our toolbar
          
          var $toolbar = $('#toolbar');
          var height = $toolbar.outerHeight();
          var cssBoxShadowValue = $toolbar.css('box-shadow');
          var boxShadow = (typeof cssBoxShadowValue !== 'undefined' && cssBoxShadowValue !== 'none');
          if (!boxShadow && /DXImageTransform\.Microsoft\.Shadow/.test($toolbar.css('filter'))) {
            height -= $toolbar[0].filters.item("DXImageTransform.Microsoft.Shadow").strength;
          }

          // Make height adjustment
          //var extraHeight = 32; // TODO: Calculate actual height
          //height += extraHeight;
          
          return height;
        
        };
      }
      
    })(jQuery);

  </script>
  
</div>
