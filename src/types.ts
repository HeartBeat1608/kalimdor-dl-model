export interface DataSetPartition {
  trainX: FinalFeatureRow[];
  trainY: FinalFeatureRow[];
  testX: FinalFeatureRow[];
  testY: FinalFeatureRow[];
}

export interface DatasetRow {
  State_Name: string;
  District_Name: string;
  Crop_Year: string;
  Season: string;
  Crop: string;
  Area: string;
  Production: string;
}

export interface FeatureRow {
  State_Name: string;
  Season: string;
  Area: string;
  Production: string;
}

export interface FinalFeatureRow {
  State_Name: number;
  Season: number;
  Area: number;
  Production: number;
}

export interface SeasonWiseDataset {
  Kharif: FeatureRow[];
  Rabi: FeatureRow[];
}

export const SEASON_CODES = {
  Kharif: 1,
  Rabi: 2,
  "Whole Year": 3,
};
