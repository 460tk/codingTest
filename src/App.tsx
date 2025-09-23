import { useEffect, useState, useCallback } from "react";
import Highcharts, {
  type SeriesOptionsType,
  type SeriesLineOptions,
} from "highcharts";
import PrefectureSelector from "./conpornents/PrefectureSelector";
import PoplationDataSelector from "./conpornents/PoplationDataSelector";

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
    Map<number, PopulationCompositionPerYearResponse>
  >(new Map());
  const [categories, setCategories] = useState<string[]>([]);
  const [poplationSelect, setPoplationSelect] = useState<string>("総人口");

  const poplationDataSelectList: string[] = [
    "総人口",
    "年少人口",
    "生産年齢人口",
    "老年人口",
  ];

  // 都道府県の取得関数
  async function prefectureGet() {
    const prefResponse = await fetch("/api/v1/prefectures");
    const prefData: PrefecturesResponse = await prefResponse.json();
    setPrefectures(prefData.result);
  }

  // 都道府県の人口データの取得関数
  const getPrefectureData = useCallback(
    async (prefCode: number, prefName: string): Promise<SeriesLineOptions> => {
      const poplationData = await (async () => {
        if (populationDataCache.has(prefCode)) {
          return populationDataCache.get(prefCode)!;
        }

        const params = new URLSearchParams();
        params.append("prefCode", prefCode.toString());
        const poplationResponse = await fetch(
          `/api/v1/population/composition/perYear?${params}`,
        );
        const fetchedPoplationData: PopulationCompositionPerYearResponse =
          await poplationResponse.json();

        setPopulationDataCache((prevCache) => {
          const newCache = new Map(prevCache);
          newCache.set(prefCode, fetchedPoplationData);
          return newCache;
        });
        return fetchedPoplationData;
      })();

      const totalPopulationData = poplationData.result.data.find(
        (item) => item.label === poplationSelect,
      );

      const data = totalPopulationData
        ? totalPopulationData.data.map((item) => item.value)
        : [];

      const newGraphLine: SeriesLineOptions = {
        type: "line",
        name: prefName,
        data: data,
      };

      if (!categories.length && totalPopulationData) {
        setCategories(
          totalPopulationData.data.map((item) => item.year.toString()),
        );
      }

      return newGraphLine;
    },
    [populationDataCache, setPopulationDataCache, categories, poplationSelect],
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
      title: { text: poplationSelect },
      xAxis: {
        title: { text: "年" },
        categories: categories,
      },
      yAxis: { title: { text: "人口数" } },
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
  }, [graphLines, categories, poplationSelect]);

  // 描画
  return (
    <>
      <h1 className="text-3xl font-bold text-center my-4">人口構成</h1>
      <h2 className="text-xl font-bold text-center my-4">表示データの選択</h2>
      <PoplationDataSelector
        poplationDataSelectList={poplationDataSelectList}
        setPoplationSelect={setPoplationSelect}
      />
      <h2 className="text-xl font-bold text-center my-4">都道府県選択</h2>
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
