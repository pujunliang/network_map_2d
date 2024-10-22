class MarkerSvg {
	d3 = null;
	color = null;
	g = null;
	/**
	 * 构造函数
	 */
	constructor(color) {
		this.color = color;
		this.utils = new Utils();
		this.markers = [];
	}

	init() {
		const $container = $("#container");
		const svgContainerHTML = "<svg id='svgPoints' class='points'></svg>";
		$container.prepend(svgContainerHTML);

		let $defs = d3.select("#svgPoints").append("defs");
		let $radialGradient = $defs
			.append("radialGradient")
			.attr("id", "radialGradient-2");

		$radialGradient
			.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", this.color)
			.attr("stop-opacity", 0);

		$radialGradient
			.append("stop")
			.attr("offset", "40%")
			.attr("stop-color", this.color)
			.attr("stop-opacity", 0);

		$radialGradient
			.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", this.color)
			.attr("stop-opacity", 1);

		// 线条横向渐变
		let $lineHorizontalGradient = $defs
			.append("linearGradient")
			.attr("id", "lineHorizontalGradient")
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "100%")
			.attr("y2", "0%");

		$lineHorizontalGradient
			.append("stop")
			.attr("offset", "0%")
			.style("stop-color", "#ff0000")
			.style("stop-opacity", 0);

		$lineHorizontalGradient
			.append("stop")
			.attr("offset", "85%")
			.style("stop-color", "#ff0000")
			.style("stop-opacity", 0.95);

		$lineHorizontalGradient
			.append("stop")
			.attr("offset", "100%")
			.style("stop-color", "#ff0000")
			.style("stop-opacity", 0);

		// 线条纵向渐变
		let $lineVecticalGradient = $defs
			.append("linearGradient")
			.attr("id", "lineVecticalGradient")
			.attr("x1", "0%")
			.attr("y1", "0%")
			.attr("x2", "0%")
			.attr("y2", "100%");

		$lineVecticalGradient
			.append("stop")
			.attr("offset", "0%")
			.style("stop-color", "#ff0000")
			.style("stop-opacity", 0);

		$lineVecticalGradient
			.append("stop")
			.attr("offset", "35%")
			.style("stop-color", "#ff0000")
			.style("stop-opacity", 0.95);

		$lineVecticalGradient
			.append("stop")
			.attr("offset", "100%")
			.style("stop-color", "#ff0000")
			.style("stop-opacity", 0);
		this.g = d3.select("#svgPoints").append("g");
	}

	/**
	 *
	 * @param {*} point
	 */
	addMarker(point) {
		let randomMarkerSize = 50; //this.utils.getRandomNum(10, 50);
		let randromR = `0;${randomMarkerSize}`;
		let $circle =
			// d3
			// 	.select("#svgPoints")
			this.g
				.append("circle")
				.attr("id", point.id)
				.attr("cx", point.x)
				.attr("cy", point.y)
				.attr("fill", "url(#radialGradient-2)");

		$circle
			.append("animate")
			.attr("attributeName", "opacity")
			.attr("dur", "2s")
			.attr("repeatCount", "indefinite")
			.attr("values", "0;1;1;0");

		$circle
			.append("animate")
			.attr("attributeName", "r")
			.attr("dur", "2s")
			.attr("repeatCount", "indefinite")
			.attr("values", randromR);
	}

	/**
	 * 绘制相交线动画
	 * @param {*} point
	 */
	addLineAnmation(point) {
		const lineWidth = 1;
		let $line1 =
			//  d3
			// 	.select("#svgPoints")
			this.g
				.append("rect")
				.attr("id", "line1")
				.attr("x", 0)
				.attr("y", point[1])
				.attr("width", window.innerWidth)
				.attr("height", lineWidth)
				.attr("fill", "url(#lineHorizontalGradient)");

		$line1
			.append("animate")
			.attr("attributeName", "width")
			.attr("from", 0)
			.attr("to", window.innerWidth)
			.attr("dur", "2s")
			.attr("fill", "freeze")
			.attr("begin", "0s");

		let $line2 = d3
			.select("#svgPoints")
			.append("rect")
			.attr("id", "line2")
			.attr("x", point[0])
			.attr("y", 0)
			.attr("width", lineWidth)
			.attr("height", window.innerHeight)
			.attr("fill", "red")
			.attr("fill", "url(#lineVecticalGradient)");

		$line2
			.append("animate")
			.attr("attributeName", "height")
			.attr("from", 0)
			.attr("to", window.innerHeight)
			.attr("dur", "2s")
			.attr("fill", "freeze")
			.attr("begin", "0s");

		this.addMarker({
			x: point[0],
			y: point[1],
		});
	}
}
