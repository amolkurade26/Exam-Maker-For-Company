import * as React from "react";
import { IQuestionSummaryProps } from "./IQuestionSummaryProps";
import { Checkbox, IStackTokens, Stack } from "office-ui-fabric-react";

export const CheckExamPreview = (props: IQuestionSummaryProps) => {
  let data = props.userData;
  return (
    <>
      <h4>Exam Preview</h4>
        {data.map((user: any) => (
          <Stack.Item shrink grow>
            {{user}}
          </Stack.Item>
          ))}
    </>
  );
}




