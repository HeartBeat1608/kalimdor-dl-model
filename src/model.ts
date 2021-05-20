import { layers, Sequential, train } from "@tensorflow/tfjs";
import { model_selection } from "kalimdor";

export const makeModel = (): Sequential => {
  const model = new Sequential({ name: "Agri_CNN" });

  // Input Layer
  model.add(
    layers.inputLayer({
      inputShape: [3],
      sparse: true,
    })
  );

  // Dropout layer 10% (anti-overfitting)
  model.add(
    layers.dropout({
      rate: 0.1,
    })
  );

  // Layer 1
  model.add(
    layers.dense({
      units: 32,
      activation: "relu",
    })
  );

  // Layer 2
  model.add(
    layers.dense({
      units: 16,
      activation: "relu",
    })
  );

  // Dropout layer 20% (anti-overfitting)
  model.add(
    layers.dropout({
      rate: 0.2,
    })
  );

  // Layer 3
  model.add(
    layers.dense({
      units: 16,
      activation: "relu",
    })
  );

  // Layer 4
  model.add(
    layers.dense({
      units: 8,
      activation: "relu",
    })
  );

  // Final Layer
  model.add(
    layers.dense({
      units: 1,
      activation: "relu",
      useBias: true,
    })
  );

  // optimizer
  const optimizer = train.adam(0.01);
  model.compile({
    optimizer,
    loss: "logCosh",
    metrics: ["accuracy"],
  });
  return model;
};

export const validation = () => {
  const kfold = new model_selection.KFold({
    k: 128,
    shuffle: true,
  });

  return kfold;
};
