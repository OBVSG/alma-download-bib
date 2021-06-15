/**
 * interface for the type Bib, some other properties from the main BIB object response can be added
 */
export interface Bib {
  mms_id: string;
  title: string;
  author: string;
  record_format: string;
  created_by: string;
  created_date: string;
  anies?: any;
  holdings?: any;
}
