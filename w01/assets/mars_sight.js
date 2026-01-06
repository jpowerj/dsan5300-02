// Author: Lawrence Hook
window.onload = function () {

	var windowHeight =  500,
		windowWidth =  700,
		restrictingDim = Math.min(2.5*windowHeight, 1.8*windowWidth),
		canvas = $("#canvas").get(0),
		context = canvas.getContext('2d'),
		traceCanvas = $("#traceCanvas").get(0),
		traceContext = traceCanvas.getContext('2d'),
		sunSize = restrictingDim/100,
		planetSize = restrictingDim/200,
		theSunPtolemy = new Ball(sunSize, "#ffff00"),
		theEarthPtolemy = new Ball(planetSize, "#3399ff"),
		marsPtolemy = new Ball(planetSize, "#ff0000"),
		theSunCopernicus = new Ball(sunSize, "#ffff00"),
		theEarthCopernicus = new Ball(planetSize, "#3399ff"),
		marsCopernicus = new Ball(planetSize, "#ff0000"),
		sunAngle = 0,
		marsAngle = 0,
		sunSpeed = -0.02,
		marsSpeed = sunSpeed/1.88,
		sunDist = restrictingDim / 14,
		sunOrbitPtolemy = new Circle(sunDist, "#0008"),
		earthOrbitCopernicus = new Circle(sunDist, "#0008"),
		marsDist = restrictingDim / 10,
		marsOrbitPtolemy = new Circle(marsDist, "#0008"),
		marsOrbitCopernicus = new Circle(marsDist, "#0008"),
		marsEpicycle = new Circle(sunDist, "#0008"),
		ptolemySight = new Line(),
		copernicusSight = new Line(),
		playBool = false,
		traceBool = false,
		losBool = false,
		canvasDim = 2*(marsDist + sunDist);

	// Resize the canvas(es) and place buttons below them
	canvas.width = 2*canvasDim;
	canvas.height = canvasDim;
	traceCanvas.width = 2*canvasDim;
	traceCanvas.height = canvasDim;
	$("#buttondiv").get(0).style.top = canvasDim + "px";
	// $("#explanation").css("top", canvasDim+"px");
	// $("#explanation").children().css("top", canvasDim+"px");

	var midx = canvas.width / 2,
		midy = canvas.height / 2;

	theEarthPtolemy.x = midx / 2;
	theEarthPtolemy.y = midy;

	marsOrbitPtolemy.x = midx / 2;
	marsOrbitPtolemy.y = midy;
	sunOrbitPtolemy.x = midx / 2;
	sunOrbitPtolemy.y = midy;


	theSunCopernicus.x = 3 * midx / 2;
	theSunCopernicus.y = midy;

	marsOrbitCopernicus.x = 3 * midx / 2;
	marsOrbitCopernicus.y = midy;
	earthOrbitCopernicus.x = 3 * midx / 2;
	earthOrbitCopernicus.y = midy;

	// Add button functionality 
	$("#play-button").get(0).addEventListener("click", play, false);
	$("#reset").get(0).addEventListener("click", reset, false);
	$("#trace").get(0).addEventListener("click", trace, false);
	$("#line_of_sight").get(0).addEventListener("click", lineOfSight, false);

	// Draw
	drawFrame();

	function play () {
		if (playBool) {
			playBool = false;
			$("#play-button i").get(0).className = "bi bi-play-fill";
		} else {
			playBool = true;
			$("#play-button i").get(0).className = "bi bi-pause-fill";
			drawFrame();
		}
	}

	function reset () {
		playBool = false;
		$("#play-button i").get(0).className = "glyphicon glyphicon-play";
		traceBool = false;
		traceContext.clearRect(0, 0, canvas.width, canvas.height);
		losBool = false;
		sunAngle = 0;
		marsAngle = 0;

		drawFrame();
	}
	
	function trace () {
		if (traceBool) {
			traceBool = false;
			traceContext.clearRect(0, 0, canvas.width, canvas.height);
		} else {
			traceBool = true;
		}
	}

	function lineOfSight () {
		if (losBool) {
			losBool = false;
		} else {
			losBool = true;
		}
	}

	// animate!
	function drawFrame () {
		if (playBool) {
			window.requestAnimationFrame(drawFrame, canvas);
		}
		context.clearRect(0, 0, canvas.width, canvas.height);

		var sunDistx = sunDist*Math.cos(sunAngle),
			sunDisty = sunDist*Math.sin(sunAngle);
		
		// Copernicus
		theEarthCopernicus.x = theSunCopernicus.x - sunDistx;
		theEarthCopernicus.y = theSunCopernicus.y - sunDisty;

		marsEpicycle.x = theEarthCopernicus.x + marsDist*Math.cos(marsAngle);
		marsEpicycle.y = theEarthCopernicus.y + marsDist*Math.sin(marsAngle);
		marsCopernicus.x = marsEpicycle.x + sunDistx;
		marsCopernicus.y = marsEpicycle.y + sunDisty;

		// Ptolemy
		theSunPtolemy.x = theEarthPtolemy.x + sunDistx;
		theSunPtolemy.y = theEarthPtolemy.y + sunDisty;

		marsEpicycle.x = theEarthPtolemy.x + marsDist*Math.cos(marsAngle);
		marsEpicycle.y = theEarthPtolemy.y + marsDist*Math.sin(marsAngle);

		marsPtolemy.x = marsEpicycle.x + sunDistx;
		marsPtolemy.y = marsEpicycle.y + sunDisty;

		// Increment angles
		sunAngle += sunSpeed;
		marsAngle += marsSpeed;
		
		// Ptolemy Model - Draw orbit lines
		sunOrbitPtolemy.draw(context);
		marsOrbitPtolemy.draw(context);
		marsEpicycle.draw(context);

		// Copernicus Model - Draw orbit lines
		earthOrbitCopernicus.draw(context);
		marsOrbitCopernicus.draw(context);

		// Trace path of Ptolemy's mars
		if (traceBool) {
			traceContext.fillStyle = marsPtolemy.color;
			traceContext.fillRect(marsPtolemy.x-1, marsPtolemy.y-1, 3, 3);
		}

		// Draw line of sight
		if (losBool) {
			var	dx = marsPtolemy.x - theEarthPtolemy.x,
				dy = marsPtolemy.y - theEarthPtolemy.y,
				dist = Math.sqrt(dx*dx + dy*dy),
				lineDist = sunDist + 1.2*marsDist;

			// Create unit vector
			dx /= dist;
			dy /= dist;

			// Multiply by wanted distance
			dx *= lineDist;
			dy *= lineDist;

			ptolemySight.x1 = theEarthPtolemy.x;
			ptolemySight.y1 = theEarthPtolemy.y;
			ptolemySight.x2 = theEarthPtolemy.x + dx;
			ptolemySight.y2 = theEarthPtolemy.y + dy;

			copernicusSight.x1 = theEarthCopernicus.x;
			copernicusSight.y1 = theEarthCopernicus.y;
			copernicusSight.x2 = theEarthCopernicus.x + dx;
			copernicusSight.y2 = theEarthCopernicus.y + dy;

			ptolemySight.color = utils.parseColor("#000080");
			copernicusSight.color = utils.parseColor("#000080");
			ptolemySight.lineWidth = 3;
			copernicusSight.lineWidth = 3;

			ptolemySight.draw(context);
			copernicusSight.draw(context);
		}

		// Ptolemy Model - Draw Planets
		theSunPtolemy.draw(context);
		theEarthPtolemy.draw(context);
		marsPtolemy.draw(context);

		// Copernicus Model - Draw planets
		theSunCopernicus.draw(context);
		theEarthCopernicus.draw(context);
		marsCopernicus.draw(context);

	}

};