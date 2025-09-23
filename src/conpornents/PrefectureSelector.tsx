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
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {prefectures?.map((prefecture) => {
        const isChecked = checkedPrefectureArray.includes(prefecture.prefCode);
        return (
          <label
            className={`relative flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors duration-200
              ${isChecked ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300 hover:bg-gray-100"}`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={isChecked}
              onChange={() => handleChenged(prefecture.prefCode)}
            />
            <p className="text-sm font-medium text-gray-700 cursor-pointer w-16 text-center">
              {prefecture.prefName}
            </p>
          </label>
        );
      })}
    </div>
  );
}
export default PrefectureSelector;
