function Line () {
	this.x1 = 0;
	this.y1 = 0;
	this.x2 = 0;
	this.y2 = 0;
	this.color = utils.parseColor("#0000000");
	this.lineWidth = 1;
}

Line.prototype.draw = function (context) {
	context.save();
	context.translate(this.x1, this.y1);
	context.lineWidth = this.lineWidth;
	
	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(this.x2 - this.x1, this.y2 - this.y1);
	context.strokeStyle = this.color;
	context.stroke();

	context.restore();
}