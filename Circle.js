var Circle = Shape.extend({

	constructor: function() {
		this.base("Circle");
	},

	draw: function(canvas) {
		canvas.strokeStyle = this.color;
		canvas.lineWidth = this.thickness;
		canvas.beginPath();
		if(this.size.x === 0 && this.size.y === 0) {
			this.size.x = this.pos.x;
			this.size.y = this.pos.y;
		}
		canvas.arc(this.pos.x, this.pos.y, Math.sqrt(this.radius), 0, 2 * Math.PI, false);
		canvas.stroke();
		this.base(canvas);
	},

	drawing:function(point) {
		this.size.x = point.x;
		this.size.y = point.y;
		this.radius = Math.pow((this.pos.x - this.size.x), 2) + Math.pow((this.pos.y - this.size.y), 2);
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
		var rad = Math.sqrt(this.radius);
		if((this.pos.x - rad) > p1 || (this.pos.y - rad) > p2) {
			this.shapeSelected = false;
		} else if((this.pos.x + rad) < p1 || (this.pos.x + rad) < p2) {
			this.shapeSelected = false;
		} else {
			this.shapeSelected = true;
		}
	},

	moving: function(p1, p2) {
		this.pos.x = p2.x;
		this.pos.y = p2.y;
	},
});