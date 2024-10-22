class FlyLine {
	constructor(option) {
		const { color, width } = option;
		this.ctx = null;
		this.bgColor = "#111";
		this.gravity = 0; //0.03;
		this.particleColor = color || "#ff0000";
		this.particalW = width || 5;
		this.width = 0;
		this.height = 0;
		this.o = null;

		this.particles = {};
		this.flyLines = {};
		// 初始化
		this.init();

		this.marker = new FlashMarker({
			color,
			speed: 0.18,
		});
	}

	init() {
		this.canvas = document.getElementById("lineCanvas");
		this.ctx = this.canvas.getContext("2d");
		this.width = this.canvas.width = this.canvas.clientWidth;
		this.height = this.canvas.height = this.canvas.clientHeight;
		this.o = {
			x: Math.floor(this.width / 2),
			y: Math.floor(this.height / 2),
		};

		this.edge = {
			top: -this.o.y,
			right: this.width - this.o.x,
			bottom: this.height - this.o.y,
			left: -this.o.x,
		};
	}

	// resize() {

	// 	this.width = this.canvas.width = this.canvas.clientWidth;
	// 	this.height = this.canvas.height = this.canvas.clientHeight;
	// }

	addFlyLine(start, end) {
		// const speed = 0.03;
		this.newFlyLines(
			start.x,
			start.y,
			end.x,
			end.y,
			// (end.x - start.x) * speed,
			// (end.y - start.y) * speed,
			// mouse.x,
			// mouse.y,
			// (pos1.x - mouse.x) * 0.03,
			// (pos1.y - mouse.y) * 0.03,
			600
		);
	}

	newParticle = (function () {
		let nextIndex = 0;
		return function (x, y, r, o, c, xv, yv, rv, ov) {
			this.particles[++nextIndex] = {
				index: nextIndex,
				x: x,
				y: y,
				r: r,
				o: o,
				c: c,
				xv: xv,
				yv: yv,
				rv: rv,
				ov: ov,
			};
		};
	})();

	newFlyLines = (function () {
		let nextIndex = 0;
		return function (startX, startY, endX, endY, life) {
			const speed = 0.025;
			this.flyLines[++nextIndex] = {
				index: nextIndex,
				x: startX,
				y: startY,
				eX: endX,
				eY: endY,
				xv: (endX - startX) * speed,
				yv: (endY - startY) * speed,
				life: life,
			};
		};
	})();

	render() {
		// this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.marker.render();

		this.ctx.globalCompositeOperation = "destination-atop";
		this.ctx.globalAlpha = 0;
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0, 0, this.width, this.height);
		this.ctx.globalCompositeOperation = "lighter";

		for (let i in this.particles) {
			let p = this.particles[i];
			this.ctx.beginPath();
			this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
			this.ctx.globalAlpha = p.o;
			this.ctx.fillStyle = p.c;
			this.ctx.fill();
		}

		for (let i in this.particles) {
			let p = this.particles[i];
			p.x += p.xv;
			p.y += p.yv;
			p.r += p.rv;
			p.o += p.ov;
			if (p.r < 0) delete this.particles[p.index];
			if (p.o < 0) delete this.particles[p.index];
		}

		for (let i in this.flyLines) {
			let f = this.flyLines[i];
			let numParticles = Math.sqrt(f.xv * f.xv + f.yv * f.yv) / 5;
			if (numParticles < 1) numParticles = 1;
			let numParticlesInt = Math.ceil(numParticles) * 2,
				numParticlesDif = numParticles / numParticlesInt;
			for (let j = 0; j < numParticlesInt; j++) {
				this.newParticle(
					f.x - (f.xv * j) / numParticlesInt,
					f.y - (f.yv * j) / numParticlesInt,
					this.particalW,
					numParticlesDif,
					this.particleColor,
					0.1,
					0.1,
					// Math.random() * 0.6 - 0.3,
					// Math.random() * 0.6 - 0.3,
					-0.3,
					-0.05 * numParticlesDif
				);
			}
			f.x += f.xv;
			f.y += f.yv;
			f.yv += this.gravity;

			if (this.isPointNear(f.x, f.y, f.eX, f.eY, 1)) {
				delete this.flyLines[f.index];
				this.marker.addMarker({
					x: f.eX,
					y: f.eY,
				});
			}

			if (--f.life < 0) delete this.flyLines[f.index];
		}
	}

	/**
	 * 判断2点直接距离是否小于指定阈值 threshold
	 * @param {*} x1
	 * @param {*} y1
	 * @param {*} x2
	 * @param {*} y2
	 * @param {*} threshold
	 * @returns
	 */
	isPointNear(x1, y1, x2, y2, threshold) {
		let dx = x1 - x2;
		let dy = y1 - y2;
		let distance = Math.sqrt(dx * dx + dy * dy);
		return distance <= threshold;
	}
}
