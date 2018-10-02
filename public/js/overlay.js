CustomOverlay.prototype = new google.maps.OverlayView();

/** @constructor */
function CustomOverlay(bounds, defText, attText, map, id) {

    // Initialize all properties.
    this.bounds_ = bounds;
    this.defText_ = defText;
    this.attText_ = attText;
    this.map_ = map;
    this.id_ = id;

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
CustomOverlay.prototype.onAdd = function() {
    
    var div = document.createElement('div');
    div.style.position = 'absolute';
    // Create the img element and attach it to the div.
    /*
    var p = document.createElement('p');
    p.style.textAlign = "center";
    p.style.marginTop = "15%";
    var span = document.createElement('span');
    span.innerHTML = this.defText_ + " / " + this.attText_;
    span.style.fontSize = 18;
    span.style.fontWeight = "bold";
    $(span).addClass("badge badge-white map-overlay");
    p.appendChild(span)
    div.appendChild(p);
    */
    $(div).append($("#p"+this.id_))
    this.div_ = div;

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    //$(panes.overlayLayer).append($("#p"+this.id_));
    panes.overlayLayer.appendChild(div);
};

CustomOverlay.prototype.draw = function() {
    // We use the south-west and north-east
    // coordinates of the overlay to peg it to the correct position and size.
    // To do this, we need to retrieve the projection from the overlay.
    var overlayProjection = this.getProjection();

    // Retrieve the south-west and north-east coordinates of this overlay
    // in LatLngs and convert them to pixel coordinates.
    // We'll use these coordinates to resize the div.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize the image's div to fit the indicated dimensions.
    var div = this.div_;
    /*
    $("#p"+this.id_).css("left",sw.x + 'px');
    $("#p"+this.id_).css("top",ne.y + 'px');
    $("#p"+this.id_).css("width",(ne.x - sw.x) + 'px');
    $("#p"+this.id_).css("height",(sw.y - ne.y) + 'px');
    */
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
CustomOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
};