var Square = Shape.extend({

	constructor: function() {
		this.base("Square");
	},

	draw: function(canvas) {
		canvas.strokeStyle = this.color;
		canvas.lineWidth = this.thickness;
		canvas.strokeRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
		this.base(canvas);
	},

	drawing:function(point) {
		this.size.x = point.x - this.pos.x;
		this.size.y = point.y - this.pos.y;
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
		if(this.pos.x > p1 || this.pos.y > p2) {
			this.shapeSelected = false;
		} else if((this.pos.x + this.size.x) < p1 || (this.pos.y + this.size.y) < p2) {
			this.shapeSelected = false;
		} else {
			this.shapeSelected = true;
		}
	},

	moving: function(p1, p2) {
		this.pos.x -= p1.x - p2.x;
		this.pos.y -= p1.y - p2.y;
	},

});