console.log( "Pensil.js loded" );

var Pensil = Shape.extend({

	constructor: function(pos, color, thickness) {
		this.base("Pensil");
	},

	draw: function(canvas) {
		canvas.strokeStyle = this.color;
		canvas.lineWidth = this.thickness;
		canvas.beginPath();
		
		canvas.lineCap="round";
		for (var i = 1 ; i < this._x.length; i++) {
			canvas.moveTo(this._x[i-1], this._y[i-1]);
			canvas.lineTo(this._x[i], this._y[i]);
		}
		canvas.stroke();
		this.base(canvas);
	},

	drawing:function(point) {
		this._x.push(point.x);	
		this._y.push(point.y);
	},

	added: function(canvas) {
		if(this.size.x < 0) {
			this.pos.x += this.size.x;
			this.size.x = Math.abs(this.size.x);
		}

		if(this.size.y < 0) {
			this.pos.y += this.size.y;
			this.size.y = Math.abs(this.size.y);
		}
	},

	contains: function(p1, p2) {
		var x1 = 0;
		var x2 = 500;
		var y1 = 0;
		var y2 = 500;

		for(var i = 0; i < this._x.length; i++) {
			if(this._x[i] > x1) {
				x1 = this._x[i];
			}
			if(this._x[i] < x2) {
				x2 = this._x[i];
			}
			if(this._y[i] > y1) {
				y1 = this._y[i];
			}
			if(this._y[i] < y2) {
				y2 = this._y[i];
			}
		}
		if(x2 > p1 || y2 > p2) {
			this.shapeSelected = false;
		} else if(x1 < p1 || y1 < p2) {
			this.shapeSelected = false;
		} else {
			this.shapeSelected = true;
		}
	},

	moving: function(p1, p2) {
		for(var i = 0; i < this._x.length; i++) {
			this._x[i] = p2.x + (this._x[i] - p1.x);
			this._y[i] = p2.y + (this._y[i] - p1.y);
		}
	},

});