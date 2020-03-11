interface ResponseInstance {
  display_name: string;
  responded_at: string;
  responded_by: string;
  comment: string;

  referenced?: number[];
}

export default ResponseInstance;
