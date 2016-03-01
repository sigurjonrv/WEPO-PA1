var Line = Shape.extend({

	constructor: function() {
		this.base("Line");
	},

	draw: function(canvas) {
		canvas.beginPath();
		canvas.strokeStyle = this.color;
		canvas.lineWidth = this.thickness;
		canvas.moveTo(this.pos.x, this.pos.y);
		if(this.size.x === 0 && this.size.y === 0) {
			this.size.x = this.pos.x;
			this.size.y = this.pos.y;
		}
		canvas.lineTo(this.size.x, this.size.y);
		canvas.stroke();
		canvas.closePath();
		this.base(canvas);
	},

	drawing:function(point) {
		this.size.x = point.x;
		this.size.y = point.y;
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
		if((p1 > this.size.x || p1 < this.pos.x) || (p2 > this.size.y || p2 < this.pos.y)) {
			this.shapeSelected = false;	
		} else {
			this.shapeSelected = true;
		}
		
	},

	moving: function(p1, p2) {
		this.pos.x -= p1.x - p2.x;
		this.pos.y -= p1.y - p2.y;
		this.size.x = Math.abs(this.size.x - (p1.x - p2.x));
		this.size.y = Math.abs(this.size.y - (p1.y - p2.y));
	},

});