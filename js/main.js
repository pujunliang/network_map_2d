const global = typeof window === "undefined" ? {} : window;
const requestAnimationFrame =
	global.requestAnimationFrame ||
	global.mozRequestAnimationFrame ||
	global.webkitRequestAnimationFrame ||
	global.msRequestAnimationFrame ||
	function (callback) {
		return global.setTimeout(callback, 1000 / 60);
	};

class Main {
	map = null;
	flyLine = null;
	utils = null;
	constructor() {}

	init() {
		window.addEventListener("DOMContentLoaded", () => {
			this.utils = new Utils();

			// 地图
			this.map = new Map(this.o);
			this.map.init();

			this.flyLine = new FlyLine({
				color: "#ff0000",
				width: 4,
				canvasWidth: this.width,
				canvasHeight: this.height,
				o: this.o,
			});
			this.loadFlyLine();

			// svg marker
			this.svgMarker = new MarkerSvg("#ff0000");
			this.svgMarker.init();
			let center = { cityname: "北京", lon: 116.46, lat: 39.92 };
			let centerPos = projection([center.lon, center.lat]);
			this.svgMarker.addLineAnmation(centerPos);

			// bottom-console
			this.bottomConsole = new ConsoleManager.BottomConsole();
			//left
			leftComputer.init();
			let leftCharts = new LeftCharts();
			leftCharts.setLeftAreaChart();
			leftCharts.setRankingChart();
			this.render();

			this.map.registerMoveCallback(
				this.throttle((t, s) => {
                    this.updateTransform(t, s)
				}, 500)
			);
		});
	}

	updateTransform(t, s) {
		// 根据SVG的位移和缩放比例来更新FlyLine Canvas的状态
		this.flyLine.ctx.setTransform(s, 0, 0, s, t[0], t[1]);
		// 清除FlyLine旧的canvas内容
		this.flyLine.ctx.clearRect(
			0,
			0,
			this.flyLine.width,
			this.flyLine.height
		);

		// 根据SVG的位移和缩放比例来更新 Marker Canvas的状态
		this.flyLine.marker.context.setTransform(s, 0, 0, s, t[0], t[1]);
		// 清除Marker旧的canvas内容
		this.flyLine.marker.context.clearRect(
			0,
			0,
			this.flyLine.width,
			this.flyLine.height
		);
		this.svgMarker.g.attr(
			"transform",
			"translate(" + t + ")scale(" + s + ")"
		);
	}

	loadFlyLine() {
		let city2Len = city2.length;
		const getLineData = () => {
			let lastIndex, curIndex;
			const getLineIndex = () => {
				curIndex = this.utils.getRandomNum(0, city2Len);
				if (lastIndex && lastIndex != curIndex) {
				} else {
					lastIndex = curIndex;
					getLineIndex();
				}
			};
			getLineIndex();
			return {
				from: city2[curIndex],
				to: city2[lastIndex],
			};
		};

		setInterval(() => {
			let lineData = getLineData();
			let { from, to } = lineData;
			//    let from = { cityname: "北京", lon: 116.46, lat: 39.92 };
			//    let to = { cityname: "莫斯科", lon: 37.35, lat: 55.45 };
			if (from?.lon && from?.lat && to?.lon && to?.lat) {
				let startArr = projection([from.lon, from.lat]);
				let endArr = projection([to.lon, to.lat]);
				this.flyLine.addFlyLine(
					{
						x: startArr[0],
						y: startArr[1],
					},
					{
						x: endArr[0],
						y: endArr[1],
					}
				);
			}
		}, 500);
	}
	throttle(fn, threshhold, scope) {
		threshhold || (threshhold = 250);
		let last, timer;
		return function () {
			let context = scope || this;
			let now = +new Date(),
				args = arguments;
			if (last && now < last + threshhold) {
				// 如果在间隔时间内，则取消之前的延时调用并设置新的延时调用
				clearTimeout(timer);
				timer = setTimeout(function () {
					last = now;
					fn.apply(context, args);
				}, threshhold);
			} else {
				// 如果超过了间隔时间，非立即执行
				last = now;
				fn.apply(context, args);
			}
		};
	}
	render() {
		const that = this;
		(function drawFrame() {
			requestAnimationFrame(drawFrame);
			//todo
			that.flyLine?.render();
			that.bottomConsole?.render();
			leftComputer.render();
		})();
	}
}
