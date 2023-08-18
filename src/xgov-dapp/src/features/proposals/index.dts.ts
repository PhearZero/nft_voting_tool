
export type TemplateData = {
  period: number,
  title: string,
  author: string,
  company_name: string,
  category: string,
  focus_area: string,
  open_source: boolean,
  amount_requested: number,
  status: string,
  details: {
    abstract: string,
    team: string,
    experience: string,
    roadmap: string,
    benefits: string,
    additional: string,
  }
}
