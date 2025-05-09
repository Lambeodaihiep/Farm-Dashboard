// Existing Highcharts code
const onChartLoad = function () {
    const chart = this,
        series = chart.series[0];

    setInterval(function () {
        const x = (new Date()).getTime(), // thời gian hiện tại
            y = sensor1Value; // Giá trị giá trị thực tế

        series.addPoint([x, y], true, true);
        dataBuffer.push([x, y]);

        // Giới hạn bộ đệm dữ liệu trong 30 phút (1800 giây)
        const thirtyMinutesAgo = x - 1800 * 1000;
        while (dataBuffer.length > 0 && dataBuffer[0][0] < thirtyMinutesAgo) {
            dataBuffer.shift();
        }
    }, 1000);
};

// Create the initial data
const data = (function () {
    const data = [];
    const time = (new Date().getTime());

    for (let i = -19; i <= 0; i += 1) {
        data.push({
            x: time + i * 1000,
            y: 0 // Giá trị mặc định cho dữ liệu ban đầu
        });
    }
    return data;
}());

Highcharts.chart('container', {
    chart: {
        type: 'areaspline',
        events: {
            load: onChartLoad
        }
    },

    time: {
        useUTC: false
    },

    title: {
        text: 'Live sensor1 Data'
    },

    accessibility: {
        announceNewData: {
            enabled: true,
            minAnnounceInterval: 15000,
            announcementFormatter: function (allSeries, newSeries, newPoint) {
                if (newPoint) {
                    return 'New point added. Value: ' + newPoint.y;
                }
                return false;
            }
        }
    },

    xAxis: {
        type: 'datetime', // Trục X là thời gian thực
        tickPixelInterval: 150,
        maxPadding: 0.1
    },

    yAxis: {
        title: {
            text: 'sensor1'
        },
        min: -20, // Giá trị tối thiểu của trục Y
        max: 80, // Giá trị tối đa của trục Y
        tickInterval: 10, // Khoảng cách giữa các dấu vạch trên trục Y
        plotLines: [
            {
                value: 0,
                width: 1,
                color: '#808080'
            }
        ]
    },

    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },

    legend: {
        enabled: false
    },

    exporting: {
        enabled: false
    },

    series: [
        {
            name: 'sensor1s',
            lineWidth: 2,
            color: Highcharts.getOptions().colors[6],
            data,
            fillColor: {
                linearGradient: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 1
                },
                stops: [
                    [0, Highcharts.getOptions().colors[6]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[6]).setOpacity(0).get('rgba')]
                ]
            }
        } 
    ]
});

document.getElementById('exportButton').addEventListener('click', function () {
    const ws = XLSX.utils.json_to_sheet(dataBuffer.map(point => ({
        Time: (new Date(point[0])).toLocaleString(),
        sensor1: point[1]
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'sensor1s');
    XLSX.writeFile(wb, 'sensor1_data.xlsx');
});