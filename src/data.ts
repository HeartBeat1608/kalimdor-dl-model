import csv from "csvtojson";
import {
  DataSetPartition,
  DatasetRow,
  FeatureRow,
  FinalFeatureRow,
  SeasonWiseDataset,
} from "./types";

export const loadDataset = async (path: string): Promise<DatasetRow[]> => {
  return await csv({ output: "json" }).fromFile(path, { autoClose: true });
};

export const preprocess = async (data: DatasetRow[]): Promise<FeatureRow[]> => {
  return new Promise((resolve) => {
    const FILTER_KEY = "Season";
    const FILTER_VALUES = ["Rabi", "Kharif", "Whole Year"];

    const ds1 = data.filter((val) => FILTER_VALUES.includes(val[FILTER_KEY]));
    const ds2: FeatureRow[] = ds1.map((val) => {
      const { Area, Season, State_Name, Production } = val;
      return { State_Name, Season, Area, Production };
    });
    resolve(ds2);
  });
};

export const split_season_wise = async (
  data: FeatureRow[]
): Promise<SeasonWiseDataset> => {
  return new Promise((resolve) => {
    const kharif: FeatureRow[] = data.filter((val) =>
      ["Kharif", "Whole Year"].includes(val.Season)
    );
    const rabi: FeatureRow[] = data.filter((val) =>
      ["Rabi", "Whole Year"].includes(val.Season)
    );

    resolve({
      Kharif: kharif,
      Rabi: rabi,
    });
  });
};

export const prepareDataset = (STATE_CODES: any[]): FinalFeatureRow[] => {
  return [];
};

export const parts = (base: DatasetRow[]): DataSetPartition => {
  return {
    testX: [],
    testY: [],
    trainX: [],
    trainY: [],
  };
};
