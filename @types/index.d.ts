export type PrefecturesResponse = {
  message: string | null;
  result: Prefecture[];
};

export type Prefecture = {
  prefCode: number;
  prefName: string;
};

export type PopulationCompositionPerYearResponse = {
  message: string | null;
  result: PopulationCompositionPerYear;
};

export type PopulationCompositionPerYear = {
  boundaryYear: number;
  data: PopulationComposition[];
};

export type PopulationComposition = {
  label: string;
  data: Population[];
};

export type Population = {
  year: number;
  value: number;
  rate: number;
};
