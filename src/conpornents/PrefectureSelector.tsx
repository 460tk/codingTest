import type { Prefecture } from "../../@types/index";

interface PrefectureSelectorProps {
  prefectures: Prefecture[] | null;
  checkedPrefectureArray: number[];
  setCheckedPrefectureArray: React.Dispatch<React.SetStateAction<number[]>>;
}

function PrefectureSelector({
  prefectures,
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
