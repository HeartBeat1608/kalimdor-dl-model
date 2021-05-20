import { layers, Sequential, train, losses } from "@tensorflow/tfjs";

export const makeModel = () => {
  const model = new Sequential({ name: "Agri_CNN" });

  // Input Layer
  model.add(
    layers.conv1d({
      inputShape: [3, 1],
      activation: "relu",
      kernelSize: 4,
      filters: 4,
      strides: 1,
    })
  );

  // Dropout layer (anti-overfitting)
  model.add(
    layers.dropout({
      rate: 0.1,
    })
  );

  // Final Layer
  model.add(
    layers.dense({
      units: 1,
    })
  );

  // optimizer
  const optimizer = train.adam();
  model.compile({
    optimizer,
    loss: "logCosh",
    metrics: ["accuracy"],
  });
  return model;
};
