/**
 * jQuery plugin for creating popup flyouts
 * 
 * @author Ilija Matoski (ilijamt@gmail.com)
 */

;
( function( $, window, document, undefined ) {
    "use strict"

    // Create the defaults once
    var pluginName = "flyoutpopup",
            defaults = {
        selector: '.popupFlyoutAbleElement',
        template: '<div><h3><%= title =></h3><p><%= text %></p></div>'
    };

    /**
     * Constructor
     * 
     * @param {Object} element
     * @param {Object} options
     * @returns {_L8.Plugin}
     */
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {
        }, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    /**
     * Initialize functino
     *  
     * @returns {undefined}
     */
    Plugin.prototype.init = function() {

    };

    /**
     * Wrapper for constructor 
     * 
     * @param {Array} options
     * @returns {Plugin}
     */
    $.fn[pluginName] = function( options ) {
        var args = arguments;

        return this.each( function() {
            var _plugin = "plugin_" + pluginName,
                    data = $.data( this, _plugin ),
                    method = data ? data[options] : '';

            // Instance the plugin
            if ( !data ) {
                $.data( this, _plugin, ( data = new Plugin( this, options ) ) );

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                // performs a method passing parameters if necessary
            } else if ( data instanceof Plugin && typeof method === 'function' ) {
                method.apply( data, Array.prototype.slice.call( args, 1 ) );

                // Allow instances to be destroyed via the 'destroy' method
                if ( options === 'destroy' ) {
                    $.data( this, _plugin, null );
                }

                // Get the error if the method does not exist or is private
            } else if ( !method || options.charAt( 0 ) === '_' ) {
                $.error( 'Method ' + options + ' does not exist on jQuery.' + pluginName );
            }
        } );
    };

} )( jQuery, window, document );

