Flyout popup
===========

Creates a popup box from an element you drag so you can view it as a separate box.


Demo
----
http://jsfiddle.net/ilijamt/Ufdua/

Requirements
------------

* jQuery 1.8.3
* jQuery UI 1.9
* underscore 1.4.4 (Optional, if present it will be used for templating, instead of the function bellow )

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

(Default: __.popupFlyoutAbleElement__).

Which elements to bind to, the elements have to be inside the parent element the one you initialized the plugin
  
#### containerClass 

(Default: __.popupFlyoutContainer__).

Uses this to create the template from


#### containerIdPrefix

(Default: __pfl__).

The prefix assigned to the container

#### template

The template used to generate the popup dialogs

```html
<div class="<%= containerClass %>" 
     data-id="<%= id %>" 
     data-pflid="<%= pflId %>" 
     id="<%= containerIdPrefix %><%= id %>" 
     title="<%= title %>">
     <div><%= text %></div>
</div>
```

#### attachElementsToTarget

(Default: __true__)

Should we attach the elements to __attachTarget__.

If __attachToElement__ is __null__ it will use __attachTarget__ as the container to where it will attach the data

#### attachTarget

(Default: __body__)

Where should we attach the new popups?

#### attachToElement

(Default: __null__)

What element should we attach the popups to. If this is __null__ then it will use __attachTarget__ to attach the new popups

#### noTitleText 

(Default: __No title__)

The title to show on the popup dialog if we cannot get the data from the element of if the element data is empty.

#### noTextText 

(Default: __No text__)

The text to show if we cannot get the data from the element or if the element data is empty

#### multiplePopups

(Default: __false__)

Should we be able to show multiple popups of the same item

#### draggingOptions 

These are jQuery Draggable options, for a full list of the options see http://api.jqueryui.com/dialog/

If you decide to override the __create,drag,start,stop__ functions you will need to execute their counterparts in the plugin, they are __eventDraggableCreate, eventDraggableDrag, eventDraggableStart, eventDraggableStop__, they also receive the same arguments as their counterparts __(events, ui)__.

#### colors 

Available colors for the plugin. Everytime a element is created, a color is used, and when all the popups for an element are deleted the color is pushed back at the end of the list.

The following colors are available:

```javascript
[ "silver", "gray", "maroon", "red",
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
```

HTML Element Data
------------------

#### data-target-id

To which group this popup belongs to?

#### data-pfl-target 

The target from where we can read the text for the popup.

#### data-pfl-title

The title of the popup

#### data-pfl-target-eval

If this is __1__ then it will assume that __data-pfl-target__ is a method that needs to be executed to get the data for __text__ of the popup.

If this is __0__, or it's not set, then it reads the data from the attributes of the HTML element, like __attr(data-pfl-target)__

License
-------
Licensed under the MIT license: 

http://www.opensource.org/licenses/mit-license.php

The MIT License (MIT)

Copyright (c) 2013 Ilija Matoski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



Contributors
------------


