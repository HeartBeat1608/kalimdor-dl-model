import { layers, Sequential, train } from "@tensorflow/tfjs";

export const makeModel = (): Sequential => {
  const LEARNING_RATE = 1e-6;
  const model = new Sequential({ name: "Agri_CNN" });

  // Input Layer
  model.add(
    layers.inputLayer({
      inputShape: [3],
      sparse: true,
    })
  );

  // Layer 1
  model.add(
    layers.dense({
      units: 32,
      activation: "mish",
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
  const optimizer = train.adam(LEARNING_RATE);
  model.compile({
    optimizer,
    loss: "meanAbsoluteError",
    metrics: ["accuracy", "precision"],
  });
  return model;
};
