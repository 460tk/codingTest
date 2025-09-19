import { useEffect, useState } from "react";
import Highcharts, { type SeriesOptionsType } from "highcharts";
import PrefectureSelector from "./conpornents/PrefectureSelector";

import type { Prefecture } from "../@types/index";

interface PrefecturesResponse {
  message: string | null;
  result: Prefecture[];
}

function App() {
  const [prefectures, setPrefectures] = useState<Prefecture[] | null>(null);
  const [graphLines, setGraphLines] = useState<SeriesOptionsType[] | undefined>(
    undefined,
  );
  const [checkedPrefectureArray, setCheckedPrefectureArray] = useState<
    number[]
  >([]);

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
      <h1>都道府県選択</h1>
      <PrefectureSelector
        prefectures={prefectures}
        setGraphLines={setGraphLines}
        checkedPrefectureArray={checkedPrefectureArray}
        setCheckedPrefectureArray={setCheckedPrefectureArray}
      />
      <div id="hchart"></div>
    </>
  );
}

export default App;
