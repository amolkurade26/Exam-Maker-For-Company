import * as React from "react";
import { IQuestionSummaryProps } from "./IQuestionSummaryProps";
import { Checkbox } from "office-ui-fabric-react";

export const QuestionSummary = (props: IQuestionSummaryProps) => {
  let data = props.userData;

  return (
    <>
    <h4>Questions Summary</h4>
      {data.map((user: any) => (
        <Checkbox 
        label={user.ID} 
        checked={user.Answer ? true : false} 
        />
      ))}
    </>
  );
};
