export interface QuerySchema {
  id: string;
  query: string;
  game_id: string;
  status: string;
  createdAt: string;
  dmlAt: string;
  dmlType: string;
}

export interface QueryCreateSchema {
  query: string;
  game_id: string;
}
