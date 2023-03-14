import * as React from "react";
import { IQuestionSummaryProps } from "./IQuestionSummaryProps";
import { Checkbox, IStackTokens, Stack } from "office-ui-fabric-react";

export const QuestionSummary = (props: IQuestionSummaryProps) => {
  let data = props.userData;
  const stackinternalTokens: IStackTokens = { childrenGap: 10 };


  return (
    <>
      <h4>Questions Preview</h4>
      <Stack styles={{ root: { background: "#e9ecef", paddingBottom: 5, paddingLeft: 5 } }}>
        <Stack horizontal tokens={stackinternalTokens}>
        {data.map((user: any) => (
          <Stack.Item shrink grow>
            <Checkbox label={"Q: "+ user.ID} checked={user.Answer ? true : false} />
          </Stack.Item>
          ))}
        </Stack> 
      </Stack>
    </>
  );
};
