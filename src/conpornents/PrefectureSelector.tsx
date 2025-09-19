import { useEffect } from "react";
import { type SeriesOptionsType } from "highcharts";
import type { Prefecture } from "../../@types/index";

interface PrefectureSelectorProps {
  prefectures: Prefecture[] | null;
  setGraphLines: React.Dispatch<
    React.SetStateAction<Highcharts.SeriesOptionsType[] | undefined>
  >;
  checkedPrefectureArray: number[];
  setCheckedPrefectureArray: React.Dispatch<React.SetStateAction<number[]>>;
}

function PrefectureSelector({
  prefectures,
  setGraphLines,
  checkedPrefectureArray,
  setCheckedPrefectureArray,
}: PrefectureSelectorProps) {
  function handleChenged(prefCode: number) {
    setCheckedPrefectureArray((prevCheckedPrefectureArray) => {
      if (prevCheckedPrefectureArray.includes(prefCode)) {
        return prevCheckedPrefectureArray.filter((code) => code !== prefCode);
      } else {
        return [...prevCheckedPrefectureArray, prefCode];
      }
    });
  }

  useEffect(() => {
    if (prefectures) {
      const newGraphLines: SeriesOptionsType[] = prefectures
        .filter((prefecture) =>
          checkedPrefectureArray.includes(prefecture.prefCode),
        )
        .map((prefecture) => {
          return {
            type: "line",
            name: prefecture.prefName,
            data: [1, 4, 1, 4, 2],
          };
        });

      setGraphLines((prevGraphLines) => {
        if (JSON.stringify(prevGraphLines) === JSON.stringify(newGraphLines)) {
          return prevGraphLines;
        }
        return newGraphLines;
      });
    }
  }, [prefectures, checkedPrefectureArray, setGraphLines]);

  return (
    <div className="flex flex-wrap m-auto">
      {prefectures?.map((prefecture) => {
        return (
          <div className="m-3 w-25 text-center" key={prefecture.prefCode}>
            <label className="flex">
              <input
                className="mr-3"
                type="checkbox"
                checked={checkedPrefectureArray.includes(prefecture.prefCode)}
                onChange={() => handleChenged(prefecture.prefCode)}
              />
              <p className="text-center w-full">{prefecture.prefName}</p>
            </label>
          </div>
        );
      })}
    </div>
  );
}
export default PrefectureSelector;
