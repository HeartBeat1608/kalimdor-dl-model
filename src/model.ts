import { linear_model } from "kalimdor";

const makeModel = () => {
  return new linear_model.SGDRegressor({
    learning_rate: 0.01,
    epochs: 1000,
    clone: true,
  });
};
