var Shape = Base.extend({

	constructor:function(name) {
		this.name = name;
		this.pos = null;
		this.size = new Point(0,0);
		this.color = color;
		this._x = [];
		this._y = [];
		this.radius = 0;
		this.selected = false;
		this.thickness = html_thickness;
		this.shapeSelected = false;
	},


	draw:function(canvas) {		
		if ( this.selected === true ) {
			// show selection
		}
	},

	startDrawing:function(point) {

	},

	drawing:function(point) {

	},

	stopDrawing:function(point) {

	},

	added: function(canvas) {

	},

	contains: function(p1, p2) {

	},

	moving: function(p1, p2) {

	},
});