let projection = null;
class Map {
	width = 0;
	height = 0;
	throttleTimer = null;
	topo = null;

	path = null;
	svg = null;
	g = null;
	graticule = null;
	tooltip = null;
	zoom = null;
	zscale = null;
	topo = null;
	areaColor = "#7e858d";
	hoverAreaColor = "#fff";
	constructor(option) {
		this.width = document.getElementById("container").offsetWidth;
		this.height = this.width / 2;
	}

	init() {
		this.setup();
		this.loadData();
	}

	loadData() {
		let world = wordJSON.files["world.json"].content;
		world = JSON.parse(world);
		let countries = topojson.feature(
			world,
			world.objects.countries
		).features;
		// 过滤南极洲
		this.topo = countries.filter(
			(item) => item.properties.name !== "Antarctica"
		);
		this.draw(this.topo);
	}

	setup() {
		d3.select(window).on("resize", this.throttle);
		this.graticule = d3.geo.graticule();
		this.tooltip = d3
			.select("#container")
			.append("div")
			.attr("class", "tooltip hidden");
		this.zoom = d3.behavior
			.zoom()
			.scaleExtent([1, 9])
			.on("zoom", this.move.bind(this));

		projection = d3.geo
			.mercator()
			.translate([this.width / 2, this.height / 2 + 100])
			.scale(this.width / 2 / Math.PI);

		this.path = d3.geo.path().projection(projection);

		this.svg = d3
			.select("#container")
			.append("svg")
			.attr("width", this.width)
			.attr("height", this.height + 8)
			.call(this.zoom)
			.on("click", this.click)
			.append("g");

		this.g = this.svg.append("g");
	}

	draw(topo) {
		//   this.svg.append("path")
		//   .datum(this.graticule)
		//   .attr("class", "graticule")
		//   .attr("d", this.path);
		/*
          g.append("path")
          .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
          .attr("class", "equator")
          .attr("d", path);
        */

		const country = this.g.selectAll(".country").data(topo);

		let strokeWidth = 1.5;
		this.zscale && (strokeWidth = strokeWidth / this.zscale);

		country
			.enter()
			.insert("path")
			.attr("class", "country")
			.attr("d", this.path)
			.attr("id", function (d, i) {
				return d.id;
			})
			.attr("title", function (d, i) {
				return d.properties.name;
			})
			.style("fill", this.areaColor)
			.style("opacity", 0.8)
			.style("stroke", "#151515")
			.style("stroke-width", strokeWidth);

		//offsets for tooltips
		let offsetL = document.getElementById("container").offsetLeft + 20;
		let offsetT = document.getElementById("container").offsetTop + 10;

		const getSelectPath = (name) => {
			return d3.selectAll("path").filter(function (d, i) {
				return d.properties.name === name; //d.properties.name;
			});
		};

		//tooltips
		country
			.on("mousemove", (d, i) => {
				const mouse = d3.mouse(this.svg.node()).map((d) => parseInt(d));
				let selectPath = getSelectPath(d.properties.name);
				selectPath.style("fill", this.hoverAreaColor);
				this.tooltip
					.classed("hidden", false)
					.attr(
						"style",
						"left:" +
							(mouse[0] + offsetL) +
							"px;top:" +
							(mouse[1] + offsetT) +
							"px"
					)
					.html(d.properties.name);
			})
			.on("mouseout", (d, i) => {
				d3.selectAll("path").style("fill", this.areaColor);
				this.tooltip.classed("hidden", true);
			});

		this.addpoint(98.53, 33.26, "中 国");
		city2.forEach((cityData, index) => {
			this.addpoint(cityData.lon, cityData.lat, cityData.cityname);
			$("span.city").html(cityData.cityname);
		});
	}

	move() {
		let t = d3.event.translate;
		let s = d3.event.scale;
		this.zscale = s;
		let h = this.height / 4;

		t[0] = Math.min(
			(this.width / this.height) * (s - 1),
			Math.max(this.width * (1 - s), t[0])
		);

		t[1] = Math.min(
			h * (s - 1) + h * s,
			Math.max(this.height * (1 - s) - h * s, t[1])
		);

		this.zoom.translate(t);
		this.g.attr("transform", "translate(" + t + ")scale(" + s + ")");

		//adjust the country hover stroke width based on zoom level
		d3.selectAll(".country").style("stroke-width", 1.5 / s);
		this.moveCallback && this.moveCallback(t, s);
	}

	registerMoveCallback(moveCallback) {
		this.moveCallback = moveCallback;
	}

	redraw() {
		this.width = document.getElementById("container").offsetWidth;
		this.height = this.width / 2;
		d3.select("svg").remove();
		setup(this.width, this.height);
		this.draw(topo);
	}

	throttle() {
		window.clearTimeout(throttleTimer);
		this.throttleTimer = window.setTimeout(() => {
			this.redraw();
		}, 200);
	}

	click(e) {
		const latlon = projection.invert(d3.mouse(this));
		console.log(latlon);
	}

	//function to add points and text to the map (used in plotting capitals)
	addpoint(longitude, latitude, text) {
		const gpoint = this.g.append("g").attr("class", "gpoint");
		const x = projection([longitude, latitude])[0];
		const y = projection([longitude, latitude])[1];

		let textClass = "country-text";
		if (text != "中 国") {
			gpoint
				.append("svg:circle")
				.attr("cx", x)
				.attr("cy", y)
				.attr("class", "point")
				.attr("r", 2)
				.style("fill", "red");
			textClass = "text";
		}

		if (text.length > 0) {
			gpoint
				.append("text")
				.attr("name", text)
				.attr("x", x + 10)
				.attr("y", y + 2)
				.attr("class", textClass)
				.text(text)
				.style("fill", "#d0d4d9");
		}
	}
}
