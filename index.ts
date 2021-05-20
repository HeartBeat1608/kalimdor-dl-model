import { join, basename } from "path";
import { sortBy } from "lodash";
import chalk from "chalk";

import {
  loadDataset,
  prepareDataset,
  preprocess,
  split_season_wise,
} from "./src/data";
import {
  DatasetRow,
  FeatureRow,
  FinalFeatureRow,
  SeasonWiseDataset,
} from "./src/types";
import { getUniqueSeasons, getUniqueStates } from "./src/utils";
import { error, info, success, text_yellow } from "./src/displays";
import { Sequential } from "@tensorflow/tfjs";
import { makeModel } from "./src/model";

const DISPLAY_FULL_LOGS: boolean = false;

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
  const STATE_CODES = all_states.map((val: string, idx: number) => ({
    state: val,
    value: idx + 1,
  }));

  const finalFeatureSet: FinalFeatureRow[] = prepareDataset(STATE_CODES);

  // Build Model
  const model: Sequential = makeModel();

  // Train Model

  // Test Model

  // Evaluate Model with KFold (K=10)

  // Extimate Model with some random data from the databse itself for confirmation
};

// Entry Point of the App
main()
  .then(() => {
    console.log();
    success("Model Execution Finished.");
  })
  .catch((err) => error(err.message));
