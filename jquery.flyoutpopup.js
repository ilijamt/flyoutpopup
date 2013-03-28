/**
 * 
 * Default text - jQuery plugin for creating popup flyouts
 *
 * Author: Ilija Matoski
 *
 * Email: ilijamt@gmail.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   https://github.com/ilijamt/flyoutpopup
 *
 * Version:  0.2.0
 *
 * Features:
 *      Creates popups based on selects
 *      Can use as temporary note view from any element in the page
 *      Coloring based on the elements they were spawned from
 *      Future-compliant with HTML5 spec (will work with Webkit browsers and IE9)
 *      
 * Usage:
 *  See README at project homepage
 *
 */

;
/**
 * 
 * @param {jQuery} $
 * @param {window} window
 * @param {document} document
 * @param {undefined} undefined
 * 
 * @returns undefined
 */
( function( $, window, document, undefined ) {
    "use strict";

    var _ = window._;

    // Create the defaults once
    var pluginName = "flyoutpopup",
            defaults = {
        selector: '.popupFlyoutAbleElement',
        containerClass: 'popupFlyoutContainer',
        containerIdPrefix: 'pfl',
        template: '<div class="<%= containerClass %>" data-id="<%= id %>" data-pflid="<%= pflId %>" id="<%= containerIdPrefix %><%= id %>" title="<%= title %>"><div><%= text %></div></div>',
        attachElementsToTarget: true,
        attachTarget: 'body',
        attachToElement: null,
        noTitleText: 'No title',
        noTextText: 'No text',
        multiplePopups: false,
        draggableOptions: {
            revert: true,
            opacity: 0.75,
            create: null,
            start: null,
            drag: null,
            stop: function( event, ui ) {
                Plugin.prototype.eventDraggableStop.call( ui.helper.data( pluginName ), event, ui );
            }
        },
        colors: [ "silver", "gray", "maroon", "red",
            "purple", "fuchsia", "green", "lime", "olive", "yellow", "navy",
            "blue", "teal", "aqua", "aliceblue", "antiquewhite", "aqua",
            "aquamarine", "azure", "beige", "bisque", "black",
            "blanchedalmond", "blue", "blueviolet", "brown", "burlywood",
            "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue",
            "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
            "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
            "darkmagenta", "darkolivegreen", "darkorange", "darkorchid",
            "darkred", "darksalmon", "darkseagreen", "darkslateblue",
            "darkslategray", "darkslategrey", "darkturquoise", "darkviolet",
            "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue",
            "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro",
            "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow",
            "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory",
            "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon",
            "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow",
            "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon",
            "lightseagreen", "lightskyblue", "lightslategray",
            "lightslategrey", "lightsteelblue", "lightyellow", "lime",
            "limegreen", "linen", "magenta", "maroon", "mediumaquamarine",
            "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen",
            "mediumslateblue", "mediumspringgreen", "mediumturquoise",
            "mediumvioletred", "midnightblue", "mintcream", "mistyrose",
            "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab",
            "orange", "orangered", "orchid", "palegoldenrod", "palegreen",
            "paleturquoise", "palevioletred", "papayawhip", "peachpuff",
            "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown",
            "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen",
            "seashell", "sienna", "silver", "skyblue", "slateblue",
            "slategray", "slategrey", "snow", "springgreen", "steelblue",
            "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat",
            "whitesmoke", "yellow", "yellowgreen" ]
    };

    var _fullPluginName = "plugin_" + pluginName;

    /**
     * Constructor
     * 
     * @param {Object} element
     * @param {Object} options
     * @returns {_L8.Plugin}
     */
    function Plugin( element, options ) {

        // options
        this.options = $.extend( {
        }, defaults, options );

        // plugin internal definitions
        this.element = element;
        this._defaults = defaults;
        this._name = pluginName;

        // plugin specific definitions 
        this.attachToElementName = null;
        this.$attachElement = null;
        this.validAttachElement = false;
        this.dummyId = null;
        this.flyoutElements = null;
        this.pflCount = 0;
        this.template = null;

        if ( ( typeof _ === "function" ) && ( typeof _.VERSION !== "undefined" ) ) {
            this.template = _.template( this.options.template );
        } else {
            this.template = tmpl( this.options.template );
        }

        if ( typeof tmpl === "undefined" && ( typeof _ === "undefined" ) ) {
            $.error( "No templating engine detected, use underscore or tmpl" );
        }

        this.elementId = $( element ).prop( 'tagName' ) + "#" + $( element ).
                attr( 'id' );

        if ( typeof $( element ).attr( 'class' ) !== "undefined" ) {
            this.elementId = this.elementId + "." + $( element ).
                    attr( 'class' ).
                    split( " " ).join( "." );
        }

        this.init();
    }

    /**
     * We have started dragging the element 
     * 
     * @param {type} event
     * @param {type} ui
     * 
     * @returns {undefined}
     */
    Plugin.prototype.eventDraggableStart = function( event, ui ) {

    };

    /**
     * Draggable stop
     * pflTitle
     * @param {type} event
     * @param {type} ui
     * 
     * @returns {undefined}
     */
    Plugin.prototype.eventDraggableStop = function( event, ui ) {

        var id = $( event.target ).data( 'targetId' );
        var pflId = $( event.target ).data( 'pflId' );

        if ( !this.hasFlyoutPopup( id, pflId, true ) || this.options.multiplePopups ) {

            var title = ui.helper.data( 'pflTitle' );
            var text = ui.helper.data( 'pflTarget' );
            var evalText = ui.helper.data( 'pflTargetEval' );

            if ( evalText ) {
                text = ui.helper[text]();
            } else {
                text = ui.helper.attr( text );
            }

            pflId = this.generatePflId();
            $( event.target ).data( 'pflId', pflId );

            this.createFlyout( {
                'id': id,
                'title': title,
                'text': text,
                'pflId': pflId
            },
            ui.offset );

        }

        pflId = null;

    };

    /**
     * We have created the draggable element 
     * 
     * @param {type} event
     * @param {type} ui
     * 
     * @returns {undefined}
     */
    Plugin.prototype.eventDraggableCreate = function( event, ui ) {

    };

    /**
     * We are currently dragging the element 
     * 
     * @param {type} event
     * @param {type} ui
     * @returns {undefined}
     */
    Plugin.prototype.eventDraggableDrag = function( event, ui ) {

    };

    /**
     * A PFL Id, unique to every flyout used to track how many are out there
     * 
     * @param {String} id The id of the main container
     * 
     * @returns {String}
     */
    Plugin.prototype.generatePflId = function( id ) {

        this.pflCount++;

        if ( typeof id === "undefined" || id === null ) {
            return this.pflCount;
        }

        return id + "_" + this.pflCount;

    };

    /**
     * Initialize function
     *  
     * @returns {undefined}
     */
    Plugin.prototype.init = function() {

        this.flyoutElements = {};

        try {
            this.dummyId = new Date().getTime();
            this.attachToElementName = this.options.attachElementsToTarget || ( this.options.attachToElement === null ) ? this.options.attachTarget : this.attachToElement;
            this.$attachElement = $( this.attachToElementName );
            this.validAttachElement = ( this.$attachElement.length > 0 );
        } catch ( err ) {
            this.validAttachElement = false;
            $.error( 'Attachment element "' + this.attachToElementName + '" is not valid.' + err );
        }

        this.updatePluginState();
    };

    /**
     * Used to update the plugin state, and also rebind all the elements that need rebinding
     * 
     * @returns {undefined}
     */
    Plugin.prototype.updatePluginState = function() {
        this.bindDraggable();
    };

    /**
     * Bind's all the draggable elements.
     * You should call this function to rebind the newly created elements.
     * 
     * @returns {undefined}
     */
    Plugin.prototype.bindDraggable = function() {

        var $elements = $( this.options.selector + ":not(.ui-draggable)" );

        if ( $elements.length > 0 ) {

            var elementId = this.elementId;
            var self = this;

            $elements.each( function(
                    index, element ) {
                $( element ).data( pluginName, self );
            } ).draggable( this.options.draggableOptions );

            elementId = null;
            self = null;

            return true;
        }

        return false;
    };

    /**
     * Un-Highlight all the flyouts with a color assigned to the popups
     * 
     * @param {String} id
     * 
     * @returns {Boolean}
     */
    Plugin.prototype.unhighlightFlyouts = function( id ) {

        if ( typeof id === "undefined" || id === null ) {
            return false;
        }

        if ( typeof this.flyoutElements[id] === "undefined" || this.flyoutElements[id] === null ) {
            return false;
        }

        if ( !( this.flyoutElements[id].length > 0 ) ) {
            return false;
        }

        $.each( this.flyoutElements[id]['items'], function( index, element ) {

            var originalBackgroundColor = $( element ).
                    data( 'originalBackgroundColor' );

            $( element ).
                    css( 'background-color', !( typeof originalBackgroundColor === "undefined" || originalBackgroundColor === null ) ? originalBackgroundColor : '' );

        } );

        return true;

    };

    /**
     * Get the flyout group color
     * 
     * @param {String} id
     * 
     * @returns {String}
     */
    Plugin.prototype.getColor = function( id ) {

        if ( typeof this.flyoutElements[id] === "undefined" || this.flyoutElements[id] === null ) {
            return false;
        }

        return this.flyoutElements[id].color;

    };

    /**
     * Highlight all the flyouts with a color assigned to the popups
     * 
     * @param {String} id
     * 
     * @returns {Boolean}
     */
    Plugin.prototype.highlightFlyouts = function( id ) {

        if ( typeof id === "undefined" || id === null ) {
            return false;
        }

        if ( typeof this.flyoutElements[id] === "undefined" || this.flyoutElements[id] === null ) {
            return false;
        }

        if ( !( this.flyoutElements[id].length > 0 ) ) {
            return false;
        }

        var color = this.flyoutElements[id].color;

        $.each( this.flyoutElements[id]['items'], function( index, element ) {

            var originalBackgroundColor = $( element ).
                    css( 'background-color' );

            if ( !( typeof originalBackgroundColor === "undefined" || originalBackgroundColor === null ) ) {
                $( element ).
                        data( 'originalBackgroundColor', originalBackgroundColor );
            }

            $( element ).css( 'background-color', color );
        } );

        return true;
    };

    /**
     * Do we have a flyout popup on the screen for this element?
     * 
     * @param {String} id
     * @param {String} pflId
     * @param {Boolean} createNoneExist
     * 
     * @returns {Boolean}
     */
    Plugin.prototype.hasFlyoutPopup = function( id, pflId, createNoneExist ) {

        createNoneExist = typeof createNoneExist === "undefined" || createNoneExist === null ? false : createNoneExist;

        if ( createNoneExist && ( typeof this.flyoutElements[id] === "undefined" || this.flyoutElements[id] === null ) ) {
            this.flyoutElements[id] = {
                length: 0,
                color: this.options.colors.shift(), // get the next one in line
                items: {
                }
            };
        }

        if ( typeof this.flyoutElements[id] === "undefined" || this.flyoutElements[id] === null ) {
            return false;
        }

        return !( typeof this.flyoutElements[id]['items'][pflId] === "undefined" || this.flyoutElements[id]['items'][pflId] === null );
    };

    /**
     * Create a flyout of the data 
     * 
     * @param {Object} data
     * @param {Object} position
     * 
     * @returns {Boolean}
     */
    Plugin.prototype.createFlyout = function( data, position ) {

        if ( !this.validAttachElement ) {
            return false;
        }

        if ( typeof data === "undefined" || data === null ) {
            data = {
            };
        }

        if ( typeof position === "undefined" || position === null ) {
            position = {
                top: 0,
                left: 0
            };
        }

        data['id'] = typeof data['id'] === "undefined" || data['id'] === null ? this.dummyId : data['id'];
        data['pflId'] = typeof data['pflId'] === "undefined" || data['pflId'] === null ? this.generatePflId() : data['pflId'];

        data = $.extend( {
            'containerClass': this.options.containerClass,
            'containerIdPrefix': this.options.containerIdPrefix,
            'title': this.options.noTitleText,
            'text': this.options.noTextText
        },
        data );

        if ( this.hasFlyoutPopup( data['id'], data['pflId'], true ) && !this.options.multiplePopups ) {
            // we already have a popup available
            return true;
        }

        var $element = $( this.template( data ) );
        var self = this;

        $element.dialog( {
            dialogClass: "alert",
            close: function( event, ui ) {
                self.closeFlyout( data['id'], data['pflId'] );
            }
        } );

        $element.dialog( 'option', 'position', [
            position.left, position.top
        ] );

        this.flyoutElements[data['id']]['items'][data['pflId']] = $element;
        this.flyoutElements[data['id']].length++;

        return true;

    };

    /**
     * Close a flyout and delete it from the data 
     * 
     * @param {type} id
     * @param {type} pflId
     * @returns {Boolean}
     */
    Plugin.prototype.closeFlyout = function( id, pflId ) {

        if ( typeof this.flyoutElements[id] === "undefined" || this.flyoutElements[id] === null ) {
            return false;
        }

        if ( typeof this.flyoutElements[id]['items'][pflId] === "undefined" || this.flyoutElements[id]['items'][pflId] === null ) {
            // the element is not present 
            return false;
        }

        this.flyoutElements[id]['items'][pflId].dialog( 'destroy' );
        this.flyoutElements[id]['items'][pflId].remove();

        this.flyoutElements[id]['items'][pflId] = null;
        delete this.flyoutElements[id]['items'][pflId];
        this.flyoutElements[id].length--;

        if ( Object.keys( this.flyoutElements[id]['items'] ).length < 1 ) {
            this.options.colors.push( this.flyoutElements[id].color );
            this.flyoutElements[id] = null;
            delete this.flyoutElements[id];
        }

        return true;

    };

    /**
     * Initialize function
     *  
     * @returns {undefined}
     */
    Plugin.prototype.destroy = function() {

        // remove bindings for the plugin 
        $( this.options.selector ).each( function(
                index, element ) {
            $( element ).removeData( pluginName );
        } );

        // remove the bindings
        $.each( this.flyoutElements, function( id, elements ) {
            $.each( elements['items'], function( index, element ) {
                $( element ).remove(); // remove it from the DOM
            } );
        } );

        this.flyoutElements = null;
        this.options = null;
        this.element = null;
        this._defaults = null;
        this._name = null;
        this.attachToElementName = null;
        this.$attachElement = null;
        this.validAttachElement = null;
        this.dummyId = null;
        this.flyoutElements = null;
        this.pflCount = null;

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

            var _plugin = _fullPluginName,
                    data = $.data( this, _plugin ),
                    method = data ? data[options] : '';

            if ( !data ) {
                $.data( this, _plugin, ( data = new Plugin( this, options ) ) );

            } else if ( data instanceof Plugin && typeof method === 'function' ) {
                method.apply( data, Array.prototype.slice.call( args, 1 ) );

                if ( options === 'destroy' ) {
                    $.data( this, _plugin, null );
                    $.removeData( this, _plugin );
                    _plugin = null;
                }

            } else if ( !method || options.charAt( 0 ) === '_' ) {
                $.error( 'Method ' + options + ' does not exist on jQuery.' + pluginName );
            }
        } );
    };

} )( jQuery, window, document );