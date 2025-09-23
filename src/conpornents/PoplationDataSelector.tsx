interface PoplationDataSelectorProps {
  poplationDataSelectList: string[];
  setPoplationSelect: React.Dispatch<React.SetStateAction<string>>;
}

function PoplationDataSelector({
  poplationDataSelectList,
  setPoplationSelect,
}: PoplationDataSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      <label className="text-sm font-medium text-gray-700 p-2">
        グラフの選択
      </label>
      <select
        className="border rounded-md p-2 border-gray-300"
        name="populationData"
        onChange={(e) => setPoplationSelect(e.target.value)}
      >
        {poplationDataSelectList.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default PoplationDataSelector;
