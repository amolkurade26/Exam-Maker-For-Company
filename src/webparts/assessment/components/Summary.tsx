import * as React from "react";
import { useId, useBoolean } from "@fluentui/react-hooks";
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  IDragOptions,
  ContextualMenu,
  IIconProps,
} from "@fluentui/react";
import { IconButton, PrimaryButton, Stack } from "office-ui-fabric-react";
import { IAssessmentProps } from "./IAssessmentProps";

const dragOptions: IDragOptions = {
  moveMenuItemText: "Move",
  closeMenuItemText: "Close",
  menu: ContextualMenu,
  dragHandleSelector: ".ms-Modal-scrollableContent > div:first-child",
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "12px 12px 14px 24px",
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: "inherit",
    margin: "0",
  },
  body: {
    flex: "4 4 auto",
    padding: "0 24px 24px 24px",
    overflowY: "hidden",
    selectors: {
      p: { margin: "14px 0" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
    },
  },
});

export default function Summary(props: IAssessmentProps) {
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);
  const [] = useBoolean(false);

  // const titleId = useId("title");

  function startExam() {
    props.isExamStarted(true);
  }

  return (
    <div>
        <div className={contentStyles.body}>
          <p>Test should be completed within 30 minutes</p>
          <PrimaryButton
            text="Click to start Exam"
            onClick={() => {
              startExam();
            }}
          />
        </div>
    </div>
  );
}


