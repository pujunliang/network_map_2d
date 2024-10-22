class Marker {
	/**
	 * 构造函数
	 */
	constructor(context, opts) {
		this.context = context;
		this.color = opts.color || "#ff0000";

		this.speed = opts.speed || 0.15;
		this.size = 0;
		this.R = opts.r || 20;
		this.location = opts.location;
		this.times = 0; // 渲染计数器
	}

	/**
	 * 绘制圆
	 * @param {*} location
	 * @param {*} size
	 */
	drawCircle() {
		const { x, y } = this.location;
		this.context.lineWidth = 2;
		this.context.strokeStyle = this.color;
		this.context.moveTo(x, y);
		this.context.beginPath();
		this.context.arc(x, y, this.size, 0, Math.PI * 2, false);

		this.context.closePath();
		this.context.stroke();
	}

	/**
	 * 绘制椭圆
	 */
	drawEllipse() {
		const { x, y } = this.location;
		const w = this.size,
			h = this.size / 2,
			kappa = 0.5522848,
			// control point offset horizontal
			ox = (w / 2) * kappa,
			// control point offset vertical
			oy = (h / 2) * kappa,
			// x-start
			xs = x - w / 2,
			// y-start
			ys = y - h / 2,
			// x-end
			xe = x + w / 2,
			// y-end
			ye = y + h / 2;

		this.context.strokeStyle = this.color;
		this.context.moveTo(xs, y);
		this.context.bezierCurveTo(xs, y - oy, x - ox, ys, x, ys);
		this.context.bezierCurveTo(x + ox, ys, xe, y - oy, xe, y);
		this.context.bezierCurveTo(xe, y + oy, x + ox, ye, x, ye);
		this.context.bezierCurveTo(x - ox, ye, xs, y + oy, xs, y);
		this.context.stroke();
	}

	draw(type) {
		this.context.save();
		this.context.beginPath();
		switch (type) {
			case "circle":
				this.drawCircle();
				break;
			case "ellipse":
				this.drawEllipse();
				break;
			default:
				break;
		}
		this.context.closePath();
		this.context.restore();

		this.size += this.speed;
		if (this.size > this.R) {
			this.size = 0;
		}
	}
}

class FlashMarker {
	/**
	 * 构造函数
	 */
	constructor(opts) {
		this.context = null;
		this.color = opts.color || "#ff0000";

		this.speed = opts.speed || 0.15;
		this.markers = [];

		this.width = 0;
		this.height = 0;
        this.init();
		this.utils = new Utils();
	}

	init() {
		this.canvas = document.getElementById("pointsCanvas");
		this.context = this.canvas.getContext("2d");
		this.width = this.canvas.width = this.canvas.clientWidth;
		this.height = this.canvas.height = this.canvas.clientHeight;
	}

	/**
	 * 添加 marker
	 */
	addMarker(location) {
		let markers = this.markers;
		let R = this.utils.getRandomNum(15, 20);
		let newMarker = new Marker(this.context, {
			color: this.color,
			speed: this.speed,
			r: R,
			location,
		});
		markers.push(newMarker);
	}

	//上层canvas渲染，动画效果
	render() {
		if (!this.context) {
			return;
		}
		const prev = this.context.globalCompositeOperation;
		this.context.globalCompositeOperation = "destination-in"; // "destination-in";
        //设置主canvas的绘制透明度
        this.context.globalAlpha = 0.95;
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.globalCompositeOperation = prev;

		for (let i = 0; i < this.markers.length; i++) {
			const marker = this.markers[i];
			marker.draw("circle");
			marker.times++;
			if (marker.times > 60 * 2) {
				this.markers.splice(i, 1); // remove
			}
		}
	}
}
