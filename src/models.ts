export type VariableType = 'INT64' | 'FLOAT64' | 'STRING' | 'BOOLEAN';
export type VariableAccess = 'READ_ONLY' | 'READ_WRITE';

export interface VariableDefinitionModel {
  id: number;
  key: string;
  dataType: VariableType;
  access: VariableAccess;
  experimental?: boolean;
}

export interface VariableStateModel {
  id: number;
  value: number | string | boolean;
  timestampNs: number;
  quality?: 'GOOD' | 'BAD' | 'UNCERTAIN';
}
