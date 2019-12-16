import faker from "faker";
import dayjs from "dayjs";

const INDUSTRYS = [
  "轻工制造",
  "采掘",
  "传媒",
  "电气设备",
  "电子",
  "国防军工",
  "计算机",
  "公用事业",
  "非银金融",
  "房地产"
];
const COMPANY_NUM = 100;

const random = base => Math.floor(Math.random() * base);
const companys = [...Array(COMPANY_NUM)].map(_ => [
  faker.company.companyName(),
  INDUSTRYS[random(INDUSTRYS.length)]
]);

function getData({
  max_hold = 20,
  start_date = new Date("2013-06-30"),
  end_date = new Date("2018-12-31")
} = {}) {
  const series = [];

  for (
    let date = dayjs(start_date);
    date.isBefore(dayjs(end_date));
    date = date.add(3, "month")
  ) {
    series.push({
      date: date.format("YYYY/MM/DD"),
      assets: [
        ...new Set(
          [...Array(random(max_hold) + 1)].map(_ => random(COMPANY_NUM))
        )
      ].map(idx => ({
        name: companys[idx][0],
        industry: companys[idx][1],
        percentage: Math.floor(Math.random() * 100) / 1000
      }))
    });
  }

  return series;
}

export default getData;
