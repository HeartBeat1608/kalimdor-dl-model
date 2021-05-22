export interface DataSetPartition {
  train: FinalFeatureRow[];
  test: FinalFeatureRow[];
}

export interface DatasetRow {
  State_Name: string;
  District_Name: string;
  Crop_Year: number;
  Season: string;
  Crop: string;
  Area: number;
  Production: number;
}

export interface FeatureRow {
  State_Name: string;
  Season: string;
  Area: number;
  Production: number;
}

export interface FinalFeatureRow {
  State_Number: number;
  Season_Number: number;
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
