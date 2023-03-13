import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAssessmentProps {
  description?: string;
  context?: WebPartContext;
  userEmail?: string;
  
  isExamStarted?: any;
}
