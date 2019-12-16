import Highcharts from "highcharts";
import render_chart_1 from "./chart-1";

Highcharts.setOptions({
  credits: {
    text: "powered by riceqaunt",
    href: "https://www.ricequant.com"
  }
});

render_chart_1();
