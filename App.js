var selectButtonClick = false;

function App(canvasSelector) {
	var self = this;
	self.getEventPoint = function(e) {
		return new Point(e.pageX - self.canvasOffset.x,e.pageY - self.canvasOffset.y);
	}

	self.drawingStart = function(e) {
		var startPos = self.getEventPoint(e);
		var shape = self.shapeFactory();
		shape.pos = startPos;
		shape.color = self.color;
		shape.thickness = self.thickness;

		shape.startDrawing(startPos,self.canvasContext);
		startPos.log('drawing start');
	
		var drawing = function(e) {
			var pos = self.getEventPoint(e);
			
			shape.drawing(pos,self.canvasContext);

			self.redraw();
			shape.draw(self.canvasContext);
		}

		var drawingStop = function(e) {
			var pos = self.getEventPoint(e);
			shape.stopDrawing(pos,self.canvasContext);
			pos.log('drawing stop')

			self.shapes.push(shape);
			self.undoShapes = [];
			shape.added(self.canvasContext);

			// Remove drawing and drawingStop functions from the mouse events
			self.canvas.off({
				mousemove:drawing,
				mouseup:drawingStop
			});

			self.redraw();
		}

		// Add drawing and drawingStop functions to the mousemove and mouseup events
		self.canvas.on({
			mousemove:drawing,
			mouseup:drawingStop
		});	
	}

	self.mousedown = function(e) {
		document.getElementById('selectbutton').onclick = function() {
			document.getElementById('canvas').style.cursor = "select";
			selectButtonClick = true;
		};

		var inputButtons = document.getElementsByTagName('input');
		var shapeButtons = [];

		// Put only the shape inputs in an array
		for(var i = 0; i < 4; i++) {
			shapeButtons.push(inputButtons[i]);
		}

		// After the moving tool has been used
		for(var i = 0; i < shapeButtons.length; i++) {
			$(shapeButtons[i]).click(function () {
				document.getElementById('canvas').style.cursor = "default";
				selectButtonClick = false;
			});
		}

		if(self.shapeFactory != null) {
			if(selectButtonClick) {
				self.moveShape(e);
			}
			else {
				self.drawingStart(e);
			}
		}

		self.redraw();
	}

	self.moveShape = function(e) {
		var pos = self.getEventPoint(e);
		// Loop through the shapes and see if the mouse has
		// clicked some shape
		for(var i = self.shapes.length - 1; i >= 0; i--){
			self.shapes[i].contains(pos.x, pos.y, self.canvasContext);
			// If selected, its able to move
			if(self.shapes[i].shapeSelected){
				var moving = function(e) {
					var newPos = self.getEventPoint(e);
					self.shapes[i].moving(pos, newPos, self.canvasContext);
					pos = newPos;
					self.redraw();
				};
				var moveStop = function(e) {
					self.canvas.off({
						mousemove: moving,
						mouseup: moveStop
					});
					self.redraw();
				};
				break;
			}
		}
		self.canvas.on({
			mousemove: moving,
			mouseup: moveStop
		});	
	}

	self.redraw = function() {
		self.canvasContext.clearRect(0, 0, self.canvasContext.canvas.width, self.canvasContext.canvas.height);
		for(var i = 0; i < self.shapes.length; i++) {
			self.shapes[i].draw(self.canvasContext);
		}
	}
	
	self.clear = function() {
		self.shapes = [];
		self.undoShapes = [];
		self.redraw();
	}

	self.setThickness = function(jquery_thickness){
		self.thickness = jquery_thickness;
	}

	self.setColor = function(color) {
		self.color = color;
	}

	self.init = function() {
		// Initialize App	
		self.canvas = $(canvasSelector);
		self.canvasOffset = new Point(self.canvas.offset().left,self.canvas.offset().top);
		self.canvas.on({
			mousedown:self.mousedown
		});
		self.shapeFactory = null;
		self.canvasContext = canvas.getContext("2d");
		self.shapes = new Array();
		self.undoShapes = new Array();
		
		// Set defaults
		self.color = '#ff0000';
		self.thickness = 1;
	}

	// When undo, pop shape off the shape array
	// and put it on a undoshape array
	self.undo = function() {
		if(self.shapes.length > 0) {
			var undoItem = self.shapes.pop();
			self.undoShapes.push(undoItem);
			self.redraw();
		}
	}

	// When redo, pop shape off the undoshape array
	// and put it on the shape array
	self.redo = function() {
		if(self.undoShapes.length > 0) {
			var redoItem = self.undoShapes.pop();
			self.shapes.push(redoItem);
			self.redraw();
		}
	}

	self.save = function(){
		saved = [];
		for(var i = 0; i < self.shapes.length; i++){
			var temp = Object.create(self.shapes[i]);
			//flatten JSON object
			for(var x in temp) {
				temp[x] = temp[x];
			}
			saved.push(temp);
		}
		var doc = JSON.stringify(saved);
		localStorage.setItem("saved", doc);
	}

	/*fengum hjálp frá samnemanda með þetta fall. Ólafa Helga Jónssyni með þessa virkni*/
	self.load = function(){
		saved2 = JSON.parse(localStorage.getItem("saved"));
		self.clear();
		for(var i = 0; i < saved2.length; i++){
			if(saved2[i].name == "Line"){
				saved2[i].__proto__ = Line.prototype;
			}
			else if(saved2[i].name == "Circle"){
				saved2[i].__proto__ = Circle.prototype;
			}
			else if(saved2[i].name == "Square"){
				saved2[i].__proto__ = Square.prototype;
			}
			else{
				saved2[i].__proto__ = Pensil.prototype;
			}

			self.shapes.push(saved2[i]);
		}
		self.redraw();
	}

	self.init();
}

var app = null;
$(function() {
	// Wire up events
	app = new App('#canvas');
	$('#squarebutton').click(function(){app.shapeFactory = function() {
		return new Square();
	};});
	$('#linebutton').click(function(){app.shapeFactory = function(){
		return new Line();
	};});
	$('#circlebutton').click(function(){app.shapeFactory = function(){
		return new Circle();
	};});
	$('#penbutton').click(function(){app.shapeFactory = function() {
		return new Pensil();
	};});
	$('#penbutton').prop( "checked", (function(){app.shapeFactory = function() {
		return new Pensil();
	};}));
	$('#html_thickness').change(function(){
		app.setThickness($("#html_thickness").val());
	});
	$('#clearbutton').click(function(){app.clear()});
	$('#color').change(function(){app.setColor($(this).val())});
	$('#undobutton').click(function(){app.undo()});
	$('#redobutton').click(function(){app.redo()});
	$("#savebutton").click(function(){app.save()});
	$("#loadbutton").click(function(){app.load()});
});