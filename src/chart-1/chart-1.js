import Highcharts from "highcharts";
import Heatmap from "highcharts/modules/heatmap";
import getData from "./get_data";
import dayjs from "dayjs";
Heatmap(Highcharts);

let chart_1_data = getData();
const getIndustrys = chart_1_data => [
  ...new Set(chart_1_data.map(i => i.assets.map(j => j.industry)).flat())
];

document.querySelector("#chart-1-params").classList.remove("hide");

document
  .querySelector("#chart-1-params [name=calc]")
  .addEventListener("click", function(e) {
    const start_date = document.querySelector(
      "#chart-1-params [name=start_date]"
    ).value;
    const end_date = document.querySelector("#chart-1-params [name=end_date]")
      .value;
    const max_hold = document.querySelector("#chart-1-params [name=max_hold]")
      .value;

    if (Number.isNaN(Date.parse(start_date))) {
      alert("无效开始日期");
      return;
    }
    if (Number.isNaN(Date.parse(end_date))) {
      alert("无效结束日期");
      return;
    }
    if (start_date < "2007-01-01") {
      alert("开始日期小于阈值");
      return;
    }
    if (end_date > dayjs().format("YYYY-MM-DD")) {
      alert("结束日期小于阈值");
      return;
    }
    if (start_date >= end_date) {
      alert("开始日期大于等于结束日期");
      return;
    }
    if (max_hold < 5) {
      alert("最大标的数小于阈值");
      return;
    }
    if (max_hold > 40) {
      alert("最大标的数大于阈值");
      return;
    }

    chart_1_data = getData({ start_date, end_date, max_hold });
    initIndustrySelector(getIndustrys(chart_1_data));
    render();
  });

initIndustrySelector(getIndustrys(chart_1_data));

document.querySelector("[name=filter]").addEventListener("click", function(e) {
  const filter_list = [
    ...document.querySelectorAll("#chart-1-params [type=checkbox]")
  ]
    .filter(i => i.checked)
    .map(i => i.value);

  const filtered_data = JSON.parse(JSON.stringify(chart_1_data)).map(i =>
    Object.assign(i, {
      assets: i.assets.filter(j => filter_list.includes(j.industry))
    })
  );

  render(filtered_data);
});

function initIndustrySelector(industrys) {
  document.querySelector(
    "#chart-1-params .industry-selector"
  ).innerHTML = industrys
    .map(
      i => `<input type="checkbox" name='industry' value="${i}" checked>${i}`
    )
    .join("");
}

function render(data = chart_1_data) {
  const sorted_assets_list = [
    ...new Set(
      data
        .map(i => i.assets.map(j => ({ industry: j.industry, name: j.name })))
        .flat()
        .sort((a, b) => {
          if (a.industry > b.industry) return 1;
          if (a.industry < b.industry) return -1;
          return 0;
        })
        .map(i => JSON.stringify(i))
    )
  ].map(i => JSON.parse(i));

  const category_x = sorted_assets_list.map(i => i.name);
  const category_y = data.map(i => i.date);

  const series = data
    .map((i, idx) =>
      i.assets.map(j => ({
        name: j.name,
        x: category_x.indexOf(j.name),
        y: idx,
        value: j.percentage,
        industry: j.industry
      }))
    )
    .flat();

  Highcharts.chart("chart-1", {
    chart: {
      type: "heatmap",
      height: data.length * 60
    },

    title: {
      text: "重仓股矩阵",
      margin: 50
    },

    xAxis: {
      categories: category_x,
      tickWidth: 1,
      crosshair: true,
      gridLineWidth: 1,
      gridLineDashStyle: "Dot",
      labels: {
        rotation: "-90"
      },
      title: {
        text: `stocks count: ${category_x.length}`,
        align: "high"
      },
      plotLines: sorted_assets_list
        .map((i, idx) => Object.assign(i, { idx }))
        .filter((el, idx, arr) =>
          idx !== arr.length - 1 && el.industry === arr[idx + 1].industry
            ? false
            : true
        )
        .map(i => ({
          value: i.idx,
          dashStyle: "DashDot",
          color: "red",
          label: {
            text: i.industry,
            rotation: 0,
            textAlign: "right",
            x: -8,
            y: -6,
            style: {
              fontSize: 13
            }
          }
        }))
    },

    yAxis: {
      categories: category_y,
      tickWidth: 1,
      crosshair: true,
      gridLineDashStyle: "Dash",
      title: {
        enabled: false
      }
    },

    tooltip: {
      formatter: function() {
        return `${category_y[this.y]} ~ ${Highcharts.numberFormat(
          this.point.value * 100,
          1
        )}%<br>
      ${this.point.industry} ~ ${this.key}`;
      }
    },

    colorAxis: {
      minColor: "#f2f2f2",
      maxColor: "#ff6347",
      labels: {
        formatter: function() {
          return this.value * 100 + "%";
        }
      }
    },

    series: [
      {
        borderWidth: 1,
        data: series
        // dataLabels: {
        //   enabled: true,
        //   formatter: function() {
        //     return `${Highcharts.numberFormat(this.point.value * 100, 1)}%`;
        //   },
        //   color: "#000000",
        //   rotation: "-90",
        //   style: {
        //     fontWeight: "light"
        //   }
        // }
      }
    ]
  });
}

export default render;
