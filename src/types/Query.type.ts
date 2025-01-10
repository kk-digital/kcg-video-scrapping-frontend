export interface QuerySchema {
  id: string;
  query: string;
  game_id: string;
  status: string;
  created_at: string;
  dmlAt: string;
  dmlType: string;
}

export interface QueryCreateSchema {
  query: string;
  game_id: string;
}
