import { useEffect, useState } from "react";
import Highcharts, { type SeriesOptionsType } from "highcharts";

interface PrefecturesResponse {
  message: string | null;
  result: Prefecture[];
}

interface Prefecture {
  prefCode: number;
  prefName: string;
}

function App() {
  const [prefectures, setPrefectures] = useState<Prefecture[] | null>(null);
  const [graphLines, setGraphLines] = useState<SeriesOptionsType[] | undefined>(
    undefined,
  );

  async function apiRequest() {
    const prefResponse = await fetch("/api/v1/prefectures");
    const prefData: PrefecturesResponse = await prefResponse.json();
    setPrefectures(prefData.result);
  }

  useEffect(() => {
    try {
      apiRequest();
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (!prefectures || prefectures.length === 0) {
      return;
    }

    setGraphLines(
      prefectures.map((prefecture) => {
        return {
          type: "line",
          name: prefecture.prefName,
          data: [1, 4, 1, 4, 2],
        };
      }),
    );
  }, [prefectures]);

  useEffect(() => {
    if (!graphLines) {
      return;
    }

    const mychart = new Highcharts.Chart({
      chart: { renderTo: "hchart" },
      title: { text: "タイトル" },
      xAxis: { title: { text: "横軸" } },
      yAxis: { title: { text: "縦軸" } },
      series: graphLines,
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "top",
      },
    });
    return () => {
      mychart.destroy();
    };
  }, [graphLines]);

  return (
    <>
      <div id="hchart"></div>
    </>
  );
}

export default App;
