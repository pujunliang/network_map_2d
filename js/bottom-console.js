// 创建一个闭包
const ConsoleManager = (function () {
	let s;
	let c;
	let ctx;
	let outputConsole, w, h;

	let opts = {
		hueSpeed: 0.2,
		interval: 60,
		waitsOnLine: 5,
		repaintAlpha: 0.04,
		font: "10px Consolas",
		lineFont: "7px Consolas",
		lineHeight: 28, //px
		lineWidth: 280,
	};
	let tick = 0;
	let wait = 0;

	let linesInHeight = 0;
	let rainbows = [];
	let isLoaded = false;
	let padding = 32;
	class BottomConsole {
		constructor() {
			this.init();
		}

		async init() {
			let text = await this.fetchScriptContent();
			s = text.split("\n");
			outputConsole = document.getElementById("bottomConsole");
			c = document.getElementById("consoleCanvas");

			ctx = c.getContext("2d");
			ctx.font = opts.font;

			w = c.width = outputConsole.clientWidth - padding;
			h = c.height = outputConsole.clientHeight - padding;

			linesInHeight = h / opts.lineHeight;

			isLoaded = true;
			this.initEvents();
		}

		async fetchScriptContent() {
			try {
				let script = document.getElementById("script");

				// 使用fetch API发送请求，并等待响应
				const response = await fetch(script.src);

				// 检查响应是否成功
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				// 读取响应内容为文本
				const text = await response.text();

				// 返回脚本内容
				return text;
			} catch (error) {
				// 处理错误
				console.error(`Failed to fetch script content: ${error}`);
			}
		}

		render() {
			if (!isLoaded) return;
			++tick;
			++wait;
			const prev = ctx.globalCompositeOperation;
			ctx.globalCompositeOperation = "destination-in"; // "destination-in";
			//设置主canvas的绘制透明度
			ctx.globalAlpha = 0.95;
			// ctx.fillStyle = "rgba(0,0,0,alp)".replace("alp", opts.repaintAlpha);
			ctx.fillRect(0, 0, w, h);
			ctx.globalCompositeOperation = prev;

			if (wait >= opts.interval) {
				wait = 0;
				rainbows.push(new Rainbow());
			}

			for (var i = 0; i < rainbows.length; ++i) {
				rainbows[i].step();

				if (rainbows[i].dead) {
					rainbows.splice(i, 1);
					--i;
				}
			}
		}

		initEvents() {
			window.addEventListener("resize", function () {
				outputConsole = document.getElementById("bottomConsole");

				w = c.width = outputConsole.clientWidth - padding;
				h = c.height = outputConsole.clientHeight - padding;

				linesInHeight = h / opts.lineHeight;

				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, w, h);
				ctx.font = opts.font;
			});

			c.addEventListener("click", function () {
				ctx.fillStyle = "black";
				ctx.fillRect(0, 0, w, h);

				s.reverse();
				for (var i = 0; i < s.length; ++i)
					s[i] = s[i].split("").reverse().join("");
			});
		}
	}

	class Rainbow {
		constructor() {
			this.y = 0;
			this.wait = 0;
			this.hue = (tick * opts.hueSpeed) % 360;
		}
		step() {
			++this.wait;

			if (this.wait >= opts.waitsOnLine) {
				++this.y;
				this.wait = 0;
			}
            //ctx.fillStyle = "hsl(hue,80%,50%)".replace("hue", this.hue);
			ctx.fillStyle = "rgba(183, 185, 185, 1)"; //"hsl(hue,80%,50%)".replace("hue", this.hue);

			let x = ((this.y / linesInHeight) | 0) * opts.lineWidth,
				y = (this.y % linesInHeight) * opts.lineHeight,
				l = ctx.measureText(this.y).width;

			ctx.font = opts.font;
			ctx.fillText(s[this.y], 14 + x, y);

			ctx.font = opts.lineFont;
			ctx.fillText(this.y, 9 + x - l, y);

			if (this.y >= s.length - 1) this.dead = true;
		}
	}

	return {
		BottomConsole,
		Rainbow,
	};
})();
