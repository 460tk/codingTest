import { useEffect } from "react";
import Highcharts from "highcharts";

function App() {
  useEffect(() => {
    const mychart = new Highcharts.Chart({
      chart: { renderTo: "hchart" },
      title: { text: "タイトル" },
      xAxis: { title: { text: "横軸" } },
      yAxis: { title: { text: "縦軸" } },
      series: [
        { type: "line", name: "ライン1", data: [1, 4, 1, 4, 2] },
        { type: "line", name: "ライン2", data: [1, 7, 3, 2, 0] },
      ],
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "top",
      },
    });
    return () => {
      mychart.destroy();
    };
  }, []);

  return (
    <>
      <div id="hchart"></div>
    </>
  );
}

export default App;
