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
      <div>
        <Checkbox label="Answer you have Attempted" disabled defaultChecked>
          {" "}
        </Checkbox><br />
        <Checkbox label="Answer you have Not-Attempted" disabled>
          {" "}
        </Checkbox>
      </div>

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
                checked={user.Answer && user.Answer.length > 0  ? true : false}
                onChange={() => getSelectedQuestion(user.ID)}
              />
            </Stack.Item>
          ))}
        </Stack>
      </Stack>
    </>
  );
};
