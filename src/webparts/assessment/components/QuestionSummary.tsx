import * as React from "react";
import { IQuestionSummaryProps } from "./IQuestionSummaryProps";
import {
  Checkbox,
  FocusZone,
  getTheme,
  IRectangle,
  IStackTokens,
  ITheme,
  List,
  mergeStyleSets,
  Stack,
} from "office-ui-fabric-react";
import { useConst } from "@fluentui/react-hooks";

export const QuestionSummary = (props: IQuestionSummaryProps) => {
  let data = props.userData;
  const stackinternalTokens: IStackTokens = { childrenGap: 5 };

  function getSelectedQuestion(ID: any)  {
    alert(ID);
    props.CallbackQuestionNo(ID)
  }

  return (
    <>
      <h4>Questions Preview</h4>
      <Stack
        styles={{
          root: { background: "#e9ecef", paddingBottom: 5, paddingLeft: 5 },
        }}
      >
        <Stack horizontal tokens={stackinternalTokens}>
          {data.map((user: any) => (
            <Stack.Item shrink grow>
              <Checkbox
                label={"Q: " + user.ID}
                checked={user.Answer ? true : false}
                onChange={() => getSelectedQuestion(user.ID)}
              />
            </Stack.Item>
          ))}
        </Stack>
      </Stack>
    </>
  );
};
