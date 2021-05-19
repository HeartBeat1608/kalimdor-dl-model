import csv from "csvtojson";
import { train_test_split } from "kalimdor/model_selection";
import { DataSetPartition, DatasetRow } from "./types";

export const loadDataset = async (path: string): Promise<DatasetRow[]> => {
  return await csv({ output: "json" }).fromFile(path, { autoClose: true });
};

export const preprocess = () => {};

export const parts = (base: DatasetRow[]): DataSetPartition => {
  return {
    testX: [],
    testY: [],
    trainX: [],
    trainY: [],
  };
};
