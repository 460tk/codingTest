interface PoplationDataSelectorProps {
  poplationDataSelectList: string[];
  setPoplationSelect: React.Dispatch<React.SetStateAction<string>>;
}

function PoplationDataSelector({
  poplationDataSelectList,
  setPoplationSelect,
}: PoplationDataSelectorProps) {
  return (
    <>
      <label>ラベル</label>
      <select
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
    </>
  );
}

export default PoplationDataSelector;
