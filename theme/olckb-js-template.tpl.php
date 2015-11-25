<?php

  $path = drupal_get_path('module', 'olckb');
  drupal_add_js($path . '/js/kbToolbar.js');
  drupal_add_css($path . '/olckb.css');
  
?>

<div class="olckb-toolbar">

  <div class="widget"></div>
  
  <script class="group-template" type="text/x-template">
    
    <span class="group"></span>
    
  </script>
  <script class="button-template" type="text/x-template">
    
    <a href="#" onclick="return false" class="button" title="REPLACEMENT-TEXT">DISPLAY-TEXT</span>
    
  </script>
  <script type="text/javascript">
    
    toolbarData = <?php echo json_encode($olckb_chars) ?>;
    kbToolbar('.olckb-toolbar', toolbarData); // <-- Initialize the toolbar javascript; pass in selector and toolbar data

    (function ($) {
      if (Drupal.toolbar != undefined) {
        Drupal.toolbar.height = function() {

          // Overriding Drupal's TOOLBAR function that calculates height
          // So that we can add in the extra height needed for our toolbar
          
          var $toolbar = $('#toolbar');
          var height = $toolbar.outerHeight();
          
          // In modern browsers (including IE9), when box-shadow is defined, use the
          // normal height.
          var cssBoxShadowValue = $toolbar.css('box-shadow');
          var boxShadow = (typeof cssBoxShadowValue !== 'undefined' && cssBoxShadowValue !== 'none');
          
          // In IE8 and below, we use the shadow filter to apply box-shadow styles to
          // the toolbar. It adds some extra height that we need to remove.
          if (!boxShadow && /DXImageTransform\.Microsoft\.Shadow/.test($toolbar.css('filter'))) {
            height -= $toolbar[0].filters.item("DXImageTransform.Microsoft.Shadow").strength;
          }
          
          return height + 32; // ADDING EXTRA HEIGHT; TODO: CALCULATE ACTUAL HEIGHT TO ADD !!!!!!!!!!!!!!!
        
        };
      }
      
    })(jQuery);

  </script>
  
</div>
