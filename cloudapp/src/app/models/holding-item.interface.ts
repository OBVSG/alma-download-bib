/**
 * interface for the type Holding, some other properties from the main bib.holding response can be added
 */
export interface HoldingItem {
  holding_id: string;
  created_by: string;
  created_date: string;
  originating_system: string;
  last_modified_by: string;
  anies?: any;
}
