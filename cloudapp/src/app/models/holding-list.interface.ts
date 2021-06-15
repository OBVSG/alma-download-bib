/**
 * interface for the type list of Holdings, some other properties can be added
 */
export interface HoldingList {
  holding_id: string;
  call_number: string;
  link: string;
  location?: { desc: string; value: string };
}
