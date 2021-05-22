import { shuffle } from "lodash";
import { DatasetRow, FinalFeatureRow } from "./types";

export const getUniqueStates = (list: DatasetRow[]): string[] => {
  const values = list.map((obj) => obj.State_Name);
  return [...new Set(values)];
};

export const getUniqueSeasons = (list: DatasetRow[]): string[] => {
  const values = list.map((obj) => obj.Season);
  return [...new Set(values)];
};

export const shuffleAndNormalize = (
  data: FinalFeatureRow[]
): FinalFeatureRow[] => {
  return shuffle(data);
};
