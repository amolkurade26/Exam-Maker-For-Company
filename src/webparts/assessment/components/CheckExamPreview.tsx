import * as React from "react";
import { IQuestionSummaryProps } from "./IQuestionSummaryProps";
import {
  Checkbox,
  ChoiceGroup,
  IStackTokens,
  Label,
  Stack,
  StackItem,
  TextField,
} from "office-ui-fabric-react";

const QuestionType = {
  RADIOBUTTON: "Radio Button",
  CHECKBOX: "Checkbox",
  TEXTBOX: "Text Box",
};

export const CheckExamPreview = (props: IQuestionSummaryProps) => {
  let data = props.userData;
  let _opts: any;
  let options: any[] = [];

    // if (data.length > 0) {
    //   for(let i = 0; i < data.length; i++){
    //   let _opts = data[i].Options;
    //   _opts += data.ID;
    //   if (_opts) {
    //     _opts.split(";").map((opt: string) => {
    //       options.push({ key: opt, text: opt });
    //     });
    //   }
    //  }
    // }

  console.log("options", options);

  return (
    <>
      <h4>Exam Preview</h4>
      <Stack>
        {data.map((user: any) => (
          
          <Stack horizontal>
            <Stack>
              <Label>{"Q" + user.Id + " " + user.Question}</Label>
              <Stack.Item>
                {user.QuestionType === QuestionType.RADIOBUTTON && (
                  <>
                    <ChoiceGroup
                      options={options}
                      selectedKey={user.Answer != "" ? user.Answer : false}
                    />
                    {/* {user.Options.split(";").map((obj: any) => (
                      <><ChoiceGroup
                        options={user ? user.Options.split(";") : false}
                        selectedKey={user.Answer != "" ? user.Answer : false} /> {obj}
                        </>
                    ))} */}
                  </>
                )}
                {user.QuestionType === QuestionType.CHECKBOX && (
                  <Checkbox
                    label={user ? user.Options.split(";") : false}
                    checked={user.Answer != "" ? user.Answer : false}
                  />
                )}
                {user.QuestionType === QuestionType.TEXTBOX && (
                  //   <ChoiceGroup
                  //   options={user ? user.Options.split(";") : false}
                  //   selectedKey={user.Answer != "" ? user.Answer : false}
                  // />
                  <TextField
                    value={user.Answer != "" ? user.Answer : ""}
                    multiline
                  />
                )}
              </Stack.Item>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </>
  );
};
