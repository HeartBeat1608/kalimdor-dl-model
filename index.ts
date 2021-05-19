import { join, basename } from "path";
import { sortBy } from "lodash";

import { loadDataset } from "./src/data";
import { DatasetRow } from "./src/types";
import { getUniqueSeasons, getUniqueStates } from "./src/utils";
import { error, info, success, text_yellow } from "./src/displays";

const main = async () => {
  // Load Data
  console.clear();

  const filePath: string = join(__dirname, "src/assets/crop_production.csv");
  info(`Loading dataset from ${text_yellow(filePath)}`);

  const jsonData: DatasetRow[] = await loadDataset(filePath);
  success(`Dataset Loaded : ${text_yellow(basename(filePath))}`);

  const all_states: string[] = getUniqueStates(jsonData);
  const all_seasons: string[] = sortBy(getUniqueSeasons(jsonData));

  info(`total states: ${text_yellow(all_states.length.toString())}`);
  info(`total seasons: ${text_yellow(all_seasons.join(", ").trim())}`);

  // Build featrues

  // Build Model

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
