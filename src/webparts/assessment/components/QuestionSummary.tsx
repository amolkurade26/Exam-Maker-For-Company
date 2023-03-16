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

  function getSelectedQuestion(ID: any) {
    props.CallbackQuestionNo(ID);
  }

  return (
    <>
      <h4>Questions Preview</h4>
      {/* <Stack>
        <Stack horizontal>
          <Stack.Item>
            <Checkbox label="Attempt Questions" defaultChecked />
            <Checkbox label="Not Attempt Questions" />
          </Stack.Item>
        </Stack>
      </Stack> */}
      <Stack
        styles={{
          root: {
            background: "#e9ecef",
            paddingBottom: 5,
            paddingLeft: 5,
            width: `30%`,
          },
        }}
      >
        <Stack horizontal wrap tokens={stackinternalTokens}>
          {data.map((user: any) => (
            <Stack.Item grow={50}>
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
