export interface DataSetPartition {
  trainX: any[];
  trainY: any[];
  testX: any[];
  testY: any[];
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