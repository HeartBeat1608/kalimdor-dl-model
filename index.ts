import { join, basename } from "path";
import { sortBy } from "lodash";
import chalk from "chalk";
import "@tensorflow/tfjs-node";
import { Sequential, data, tensor1d } from "@tensorflow/tfjs";

import {
  loadDataset,
  parts,
  prepareDataset,
  preprocess,
  split_season_wise,
} from "./src/data";
import {
  DataSetPartition,
  DatasetRow,
  FeatureRow,
  FinalFeatureRow,
  SeasonWiseDataset,
} from "./src/types";
import { getUniqueSeasons, getUniqueStates } from "./src/utils";
import { error, info, success, text_yellow } from "./src/displays";
import { makeModel } from "./src/model";

console.log(process.argv);
const DISPLAY_FULL_LOGS: boolean = true;

const main = async () => {
  // Load Data
  console.clear();
  console.log(
    "--------------------" +
      chalk.bgWhite.black.bold("Agri_CNN") +
      "--------------------"
  );

  const filePath: string = join(__dirname, "src/assets/crop_production.csv");
  info(`Loading dataset from ${text_yellow(filePath)}`);

  const jsonData: DatasetRow[] = await loadDataset(filePath);
  success(`Dataset Loaded : ${text_yellow(basename(filePath))}`);

  info("Normalizing Dataset for larger values");
  jsonData.forEach((row) => {
    row.Production = parseInt(row.Production.toString()) / 1e5;
    row.Area = parseInt(row.Area.toString());
  });
  success("Dataset Production normalized");

  const all_states: string[] = sortBy(getUniqueStates(jsonData));
  const all_seasons: string[] = sortBy(getUniqueSeasons(jsonData));

  info(`total states: ${text_yellow(all_states.length.toString())}`);
  info(`total seasons: ${text_yellow(all_seasons.join(", ").trim())}`);

  // Build featrues

  info("Extracting Relevant Features from dataset");
  const dt1: FeatureRow[] = await preprocess(jsonData);
  success("Feature Extraction Complete.");

  if (DISPLAY_FULL_LOGS) {
    success("Dataset HEAD");
    console.table(dt1.slice(0, 5));
  }

  info("Splitting Dataset Season-wise");
  const dt2: SeasonWiseDataset = await split_season_wise(dt1);
  success("Season-wise Split Complete.");

  if (DISPLAY_FULL_LOGS) {
    success("Kharif HEAD");
    console.table(dt2.Kharif.slice(0, 5));
    success("Rabi HEAD");
    console.table(dt2.Rabi.slice(0, 5));
  }

  // prepare data for model
  const STATE_CODES: Map<string, number> = new Map();
  all_states.forEach((val: string, idx: number) => {
    STATE_CODES.set(val, idx + 1);
  });

  const finalKharifFeatureSet: FinalFeatureRow[] = prepareDataset(
    STATE_CODES,
    dt2.Kharif,
    1
  );
  const finalRabiFeatureSet: FinalFeatureRow[] = prepareDataset(
    STATE_CODES,
    dt2.Rabi,
    2
  );

  // Split Training and testing sets
  const TRAINING_SIZE = 0.8; // 70% for training and 30% for testing
  const { train: kharifSplitTrain, test: kharifSplitTest }: DataSetPartition =
    parts(finalKharifFeatureSet, TRAINING_SIZE);
  const { train: rabiSplitTrain, test: rabiSplitTest }: DataSetPartition =
    parts(finalRabiFeatureSet, TRAINING_SIZE);

  // Make Kharif Dataset
  const kharifX = kharifSplitTrain.map((row) =>
    Object.values(row).map((x) => parseInt(x))
  );
  const KharifY: number[] = kharifX.map((row) => row.pop() || 0);
  const kharifDataset = data
    .zip({
      xs: data.array(kharifX),
      ys: data.array(KharifY),
    })
    .batch(128)
    .shuffle(100);

  // Make Rabi Dataset
  const RabiX: number[][] = rabiSplitTrain.map((row) =>
    Object.values(row).map((x) => parseInt(x))
  );
  const RabiY: number[] = RabiX.map((row) => row.pop() || 0);

  const rabiDataset = data
    .zip({
      xs: data.array(RabiX),
      ys: data.array(RabiY),
    })
    .batch(128)
    .shuffle(100);

  // Build Model
  info("Building Model");
  const model: Sequential = makeModel();
  if (DISPLAY_FULL_LOGS) {
    model.summary();
  }
  success("Model Compiled");

  // Train Model
  const totalEpochs: number = 5;

  info("Training on Kharif Season Set");
  const kharifHistory = await model.fitDataset(kharifDataset, {
    epochs: totalEpochs,
  });

  info("Training on Rabi Season Set");
  const rabiHistory = await model.fitDataset(rabiDataset, {
    epochs: totalEpochs,
  });

  // Test Model
  const [ky, ...kx] = Object.values(kharifSplitTest[0]).reverse();
  // console.log(tensor1d(kx, "int32").transpose());
  const kprediction = model.predict(tensor1d(kx, "int32").transpose());
  const [ry, ...rx] = Object.values(rabiSplitTest[0]).reverse();
  const rprediction = model.predict(tensor1d(rx, "int32").transpose());

  console.log({
    prediction: kprediction,
    actual: ky,
    error: Math.abs(parseInt(kprediction.toString()) - ky),
  });

  console.log({
    prediction: rprediction,
    actual: ry,
    error: Math.abs(parseInt(rprediction.toString()) - ry),
  });

  // Evaluate Model with KFold (K=10)

  // Extimate Model with some random data from the databse itself for confirmation
  success(JSON.stringify(kharifHistory.history, null, 2));
  success(JSON.stringify(rabiHistory.history, null, 2));
};

// Entry Point of the App
main()
  .then(() => {
    console.log();
    success("Model Execution Finished.");
  })
  .catch((err) => error(err.message));
