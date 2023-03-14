import * as React from "react";
import { useId, useBoolean } from "@fluentui/react-hooks";
import {
  Modal,
  getTheme,
  mergeStyleSets,
  FontWeights,
  IDragOptions,
  Toggle,
  ContextualMenu,
  IIconProps,
} from "@fluentui/react";
import { DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { PrimaryButton } from "office-ui-fabric-react";
import { IAssessmentProps } from "./IAssessmentProps";

const dragOptions: IDragOptions = {
  moveMenuItemText: "Move",
  closeMenuItemText: "Close",
  menu: ContextualMenu,
  dragHandleSelector: ".ms-Modal-scrollableContent > div:first-child",
};
const cancelIcon: IIconProps = { iconName: "Cancel" };

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
  const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false);

  const titleId = useId("title");

  function startExam() {
    props.isExamStarted(true);
  }

  return (
    <div>
      {/* <DefaultButton
        secondaryText="Opens the Sample Modal"
        onClick={showModal}
        text="Before start Exam Read the Rules"
      /> */}
      {/* <Modal
        titleAriaId={titleId}
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isModeless={true}
        containerClassName={contentStyles.container}
        dragOptions={isDraggable ? dragOptions : undefined}
      > }
        { <div className={contentStyles.header}>
          <h2 className={contentStyles.heading} id={titleId}>
            Summary Details
          </h2>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div> */}

        <div className={contentStyles.body}>
          <p>Test should be completed within 30 minutes</p>
          <PrimaryButton
            text="Click to start Exam"
            onClick={() => {
              startExam();
            }}
          />
        </div>
      {/* </Modal> */}
    </div>
  );
}

const toggleStyles = { root: { marginBottom: "20px" } };
const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
