Flyout popup
===========

Creates a popup box from an element you drag so you can view it as a separate box.


Demo
----
http://jsfiddle.net/ilijamt/Ufdua/

Requirements
------------
jQuery 1.8.3
jQuery UI 1.9

The following function needs to be available for this plugin to work.
Just add it to the startup script if you don't have it.

```javascript
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
(function () {
    var cache = {};

    this.tmpl = function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.

        var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        // Convert the template into pure JavaScript
        str.replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();
```
Configuration
-------------

#### selector
-------------
(Default: __.popupFlyoutAbleElement__).
Which elements to bind to, the elements have to be inside the parent element the one you initialized the plugin
  
#### containerClass 
-------------------
(Default: __.popupFlyoutContainer__).

####
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
