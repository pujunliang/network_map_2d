class LeftCharts {
	constructor() {}
	setLeftAreaChart() {
		const option = {
			grid: {
				top: 0,
				bottom: 0,
				left: 16,
				right: 16,
				height: "100%",
			},
			xAxis: {
				type: "category",
				boundaryGap: false,
				data: ["Mon", "Tue", "Wed", "s"],
				axisTick: { show: false },
				axisLine: { show: false },
			},
			yAxis: {
				type: "value",
				axisTick: { show: false },
				axisLine: { show: false },
				splitLine: { show: false },
				axisLabel: { show: false },
			},
			series: [
				{
					data: [220, 932, 301, 825],
					type: "line",

					itemStyle: {
                        color: "rgba(198,208,209,0.65)",
                    },
					lineStyle: {
						color: "rgba(198,208,209,0.65)",
					},
					areaStyle: {
						color: "rgba(198,208,209,0.45)",
					},
				},
			],
		};
		const leftAreaCanvasDom = document.getElementById("leftAreaCanvas");
		const areaChart = echarts.init(leftAreaCanvasDom);
		areaChart.setOption(option);
	}
	setRankingChart() {
		const data = [
			[5000, 10000, 6785.71],
			[4000, 10000, 6825],
			[3000, 6500, 4463.33],
			[2500, 5600, 3793.83],
			[2000, 4000, 3060],
			[2000, 4000, 3222.33],
			[2500, 4000, 3133.33],
			[1800, 4000, 3100],
			[2000, 3500, 2750],
			[2000, 3000, 2500],
			[1800, 3000, 2433.33],
			[2000, 2700, 2375],
			[1500, 2800, 2150],
			[1500, 2300, 2100],
			[1600, 3500, 2057.14],
			[1500, 2600, 2037.5],
			[1500, 2417.54, 1905.85],
			[1500, 2000, 1775],
			[1500, 1800, 1650],
		];
		// prettier-ignore
		const cities = ['CN', 'KP', 'KR', 'VN', 'IN', 'JP', 'TH', 'US', 'D3', 'FR', 'AU', 'PK', 'AR', 'BY', 'BR', 'PH', 'BW', 'EN', 'OM'];
		const barHeight = 50;
		const option = {
			legend: {
				show: false,
			},
			grid: {
				top: 0,
			},
			angleAxis: {
				type: "category",
				data: cities,
			},
			radiusAxis: {},
			polar: {},
			series: [
				{
					type: "bar",
					itemStyle: {
						color: "rgba(198,208,209,0.75)",
					},
					data: data.map(function (d) {
						return d[0];
					}),
					coordinateSystem: "polar",
					stack: "Min Max",
					silent: true,
				},
				{
					type: "bar",
					itemStyle: {
						color: "rgba(198,208,209,0.4)",
					},
					data: data.map(function (d) {
						return d[1] - d[0];
					}),
					coordinateSystem: "polar",
					name: "Range",
					stack: "Min Max",
				},
				{
					type: "bar",
					itemStyle: {
						color: "rgba(198,208,209,0.8)",
					},
					data: data.map(function (d) {
						return d[2] - barHeight;
					}),
					coordinateSystem: "polar",
					stack: "Average",
					silent: true,
					z: 10,
				},
				{
					type: "bar",
					itemStyle: {
						color: "rgba(198,208,209,0.5)",
					},
					data: data.map(function (d) {
						return barHeight * 2;
					}),
					coordinateSystem: "polar",
					name: "Average",
					stack: "Average",
					barGap: "-100%",
					z: 10,
				},
			],
		};
		const leftRankingCanvasDom =
			document.getElementById("leftRankingCanvas");
		const rankingChart = echarts.init(leftRankingCanvasDom);
		rankingChart.setOption(option);
	}
}
