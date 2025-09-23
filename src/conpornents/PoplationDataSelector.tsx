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
      <label>グラフの選択</label>
      <select
        className="border"
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
