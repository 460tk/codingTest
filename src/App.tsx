import { useEffect, useState, useCallback } from "react";
import Highcharts, {
  type SeriesOptionsType,
  type SeriesLineOptions,
} from "highcharts";
import PrefectureSelector from "./conpornents/PrefectureSelector";

import type {
  Prefecture,
  PrefecturesResponse,
  PopulationCompositionPerYearResponse,
} from "../@types/index";

function App() {
  const [prefectures, setPrefectures] = useState<Prefecture[] | null>(null);
  const [graphLines, setGraphLines] = useState<SeriesOptionsType[] | undefined>(
    undefined,
  );
  const [checkedPrefectureArray, setCheckedPrefectureArray] = useState<
    number[]
  >([]);
  const [populationDataCache, setPopulationDataCache] = useState<
    Map<number, SeriesLineOptions>
  >(new Map());

  // 都道府県の取得関数
  async function prefectureGet() {
    const prefResponse = await fetch("/api/v1/prefectures");
    const prefData: PrefecturesResponse = await prefResponse.json();
    setPrefectures(prefData.result);
  }

  // 都道府県の人口データの取得関数
  const getPrefectureData = useCallback(
    async (
      prefCode: number,
      prefName: string,
    ): Promise<SeriesLineOptions> => {
      if (populationDataCache.has(prefCode)) {
        return populationDataCache.get(prefCode)!;
      }

      const params = new URLSearchParams();
      params.append("prefCode", prefCode.toString());
      const poplationResponse = await fetch(
        `/api/v1/population/composition/perYear?${params}`,
      );
      const poplationData: PopulationCompositionPerYearResponse =
        await poplationResponse.json();

      const totalPopulationData = poplationData.result.data.find(
        (item) => item.label === "総人口",
      );

      const data = totalPopulationData
        ? totalPopulationData.data.map((item) => item.value)
        : [];

      const newGraphLine: SeriesLineOptions = {
        type: "line",
        name: prefName,
        data: data,
      };

      setPopulationDataCache((prevCache) => {
        const newCache = new Map(prevCache);
        newCache.set(prefCode, newGraphLine);
        return newCache;
      });

      return newGraphLine;
    },
    [populationDataCache, setPopulationDataCache],
  );

  // 都道府県の取得を非同期で実行
  useEffect(() => {
    try {
      prefectureGet();
    } catch (e) {
      console.log(e);
    }
  }, []);

  // 選択項目に合わせて描画するグラフを選定
  useEffect(() => {
    if (prefectures && checkedPrefectureArray.length > 0) {
      const fetchPromises = prefectures
        .filter((prefecture) =>
          checkedPrefectureArray.includes(prefecture.prefCode),
        )
        .map((prefecture) =>
          getPrefectureData(prefecture.prefCode, prefecture.prefName),
        );

      Promise.all(fetchPromises)
        .then((resolvedGraphLines) => {
          setGraphLines((prevGraphLines) => {
            if (
              JSON.stringify(prevGraphLines) ===
              JSON.stringify(resolvedGraphLines)
            ) {
              return prevGraphLines;
            }
            return resolvedGraphLines;
          });
        })
        .catch((error) => {
          console.error("Error fetching prefecture data:", error);
        });
    } else if (checkedPrefectureArray.length === 0) {
      setGraphLines(undefined);
    }
  }, [prefectures, checkedPrefectureArray, getPrefectureData]);

  // Highchertsグラフの描画を実行
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

  // 描画
  return (
    <>
      <h1>都道府県選択</h1>
      <PrefectureSelector
        prefectures={prefectures}
        checkedPrefectureArray={checkedPrefectureArray}
        setCheckedPrefectureArray={setCheckedPrefectureArray}
      />
      <div id="hchart"></div>
    </>
  );
}

export default App;
