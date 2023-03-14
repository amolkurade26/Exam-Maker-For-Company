import * as React from "react";
import styles from "./Assessment.module.scss";
import { IAssessmentProps } from "./IAssessmentProps";
import { IAssessmentState } from "./IAssessmentState";
import { escape } from "@microsoft/sp-lodash-subset";
import DataService from "../../../service/DataService";
import { CheckExamPreview } from "./CheckExamPreview";

import {
  COLUMNS_Answers,
  COLUMNS_QUESTIONMASTER,
  COLUMNS_UserResponce,
  LIST_Answers,
  LIST_QUESTIONMASTER,
  LIST_UserResponce,
} from "../../../common/constants";
import {
  Checkbox,
  ChoiceGroup,
  PrimaryButton,
  Stack,
  StackItem,
  Text,
  TextField,
} from "office-ui-fabric-react";
import { useState } from "react";
import ThankYou from "./ThankYou";
import { QuestionSummary } from "./QuestionSummary";
import Summary from "./Summary";

const tokens = {
  sectionStack: {
    childrenGap: 10,
  },
  headingStack: {
    childrenGap: 5,
  },
};

const QuestionType = {
  RADIOBUTTON: "Radio Button",
  CHECKBOX: "Checkbox",
  TEXTBOX: "Text Box",
};

export default class Assessment extends React.Component<
  IAssessmentProps,
  IAssessmentState
> {
  public _ops: DataService;
  timer: number;

  constructor(props: IAssessmentProps) {
    super(props);
    this.state = {
      questionList: [],
      activeQuestionIndexNo: 0,
      RandomNo: 0,
      RandomNoData: [],
      radioSelected: "",
      checkBoxSelected: "",
      TextBox: "",
      time: {},
      seconds: 99999,
      checkTimeOut: false,
      questionSummaryData: false,
      summaryInfo: false,
      checkExamPreviewActive: false,
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  private secondsToTime(secs: any) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return obj;
  }

  private startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  private countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    if (seconds == 0) {
      clearInterval(this.timer);
      alert("Thank you!, Your's Exam has been end.");
      this.setState({ checkTimeOut: true });
    }
  }

  public async componentDidMount() {}

  private setAnswer(index: number, value: string) {
    let questionList = this.state.questionList;
    questionList[index].Answer = value;
    this.setState({ questionList, radioSelected: value });
  }

  private setTextBoxAnswer(index: number, data: any) {
    let questionList = this.state.questionList;
    questionList[index].Answer = data.target.value;
    this.setState({
      questionList,
      radioSelected: data.target.value,
      TextBox: data.target.value,
    });
  }

  private setCheckboxAnswer(index: number, value: string, checked: boolean) {
    let questionList = [...this.state.questionList];
    let selectedQuestion = [];
    selectedQuestion = questionList[index];
    if (selectedQuestion.Answer == "") {
      selectedQuestion.Answer = [value];
    } else if (checked == false) {
      let myIndex = selectedQuestion.Answer.indexOf(value);
      let d = selectedQuestion.Answer.splice(myIndex, 1);
      console.log("uncheck Data", d);
    } else if (selectedQuestion.Answer.length >= 1) {
      selectedQuestion.Answer.push(value);
    }
    questionList[index] = selectedQuestion;
    this.setState({ questionList: questionList });
    console.log("questionList", questionList);
  }

  private async getRamdomNo() {
    await this._ops
      .getListData(LIST_UserResponce, COLUMNS_UserResponce, "QuestionId")
      .then((data) => {
        this.setState({
          RandomNoData: data.filter(
            (d) => d.UserRamdomNo == this.state.RandomNo
          ),
        });
      });
  }

  private async saveUserAnswers(activeQuestionIndex: any) {
    try {
      await this.getRamdomNo();
      let d = this.state.RandomNoData;
      let selectedAnswer = this.state.questionList;
      let answerObj: any[] = [];
      let answer: any[] = selectedAnswer.filter((e) => e.Answer);
      let userAnswers = "";
      answer.map((e) => {
        userAnswers += "Q" + e.Id + ":" + e.Answer + ",";
      });
      answerObj.push({
        Id: d[0].Id,
        UserRamdomNo: this.state.RandomNo,
        Responce: userAnswers,
      });
      console.log("answerObj", answerObj);
      this._ops
        .updateBulkData(LIST_UserResponce, answerObj)
        .then(async (data) => {
          this.setState({
            activeQuestionIndexNo: activeQuestionIndex,
            radioSelected: this.state.questionList[activeQuestionIndex].Answer,
          });
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  private async checkScore() {
    await this.saveUserAnswers(this.state.activeQuestionIndexNo);
    let correctAnsCount: any[] = [];
    this._ops
      .getListData(LIST_Answers, COLUMNS_Answers, "QuestionId", null)
      .then((data) => {
        let finalscore = this.state.questionList;
        console.log("finalscore", finalscore);
        let correctAns: any[] = [];
        correctAns = finalscore.map((d) =>
          data.filter(
            (x) => x.QuestionId["ID"] == d.Id && x.CorrectAnswers == d.Answer
          )
        );
        for (let i = 0; i < correctAns.length; i++) {
          if (correctAns[i].length != 0) {
            correctAnsCount.push(correctAns[i]);
          }
        }
        // alert("Your have scored " + correctAnsCount.length);
        // alert("Thank you!, Your's Exam has been end.");
        this.setState({ checkTimeOut: true });
      });
  }

  private checkExamPreview() {
    alert("checkExamPreview");
    this.setState({ checkExamPreviewActive: true });
  }

  private PreviousClick(activeQuestionIndex: any) {
    if (
      this.state.questionList[activeQuestionIndex].QuestionType ==
      QuestionType.RADIOBUTTON
    ) {
      this.setState({
        activeQuestionIndexNo: activeQuestionIndex,
        radioSelected: this.state.questionList[activeQuestionIndex].Answer,
      });
    }
    if (
      this.state.questionList[activeQuestionIndex].QuestionType ==
      QuestionType.CHECKBOX
    ) {
      this.setState({
        activeQuestionIndexNo: activeQuestionIndex,
        checkBoxSelected: this.state.questionList[activeQuestionIndex].Answer,
      });
    }
    if (
      this.state.questionList[activeQuestionIndex].QuestionType ==
      QuestionType.TEXTBOX
    ) {
      this.setState({
        activeQuestionIndexNo: activeQuestionIndex,
        TextBox: this.state.questionList[activeQuestionIndex].Answer,
      });
    }
  }

  private checkQuestionSummery() {
    this.setState({ questionSummaryData: true });
  }

  private handleCallback = (isSummaryInfo: boolean) => {
    this.setState({ summaryInfo: isSummaryInfo });
    if (isSummaryInfo) {
      this.examStart();
    }
  };

  private handleCallbackQuestionNo = (QuestionNo: any) => {
    console.log("QuestionNo", QuestionNo);
    this.saveUserAnswers(QuestionNo - 1);
  };

  private examStart() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    this.startTimer();

    var minm = 10000;
    var maxm = 99999;
    let RamdomNo = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    let rNo: any[] = [];
    rNo.push({
      UserRamdomNo: `${this.props.userEmail}_${RamdomNo}`,
    });
    this._ops.createData(LIST_UserResponce, rNo).then(async (data) => {
      console.log("data", data);
      this.setState({ RandomNo: data[0].data.UserRamdomNo });
    });

    this._ops
      .getListData(
        LIST_QUESTIONMASTER,
        COLUMNS_QUESTIONMASTER,
        null,
        "IsActive eq 1"
      )
      .then((data) => {
        data.map((d) => (d.Answer = ""));
        this.setState({ questionList: data, activeQuestionIndexNo: 0 });
      });
  }

  private hideQuestionsPreview() {
    this.setState({ questionSummaryData: false });
  }

  public render(): React.ReactElement<IAssessmentProps> {
    this._ops = this.props.context.serviceScope.consume(DataService.serviceKey);
    let { questionList, activeQuestionIndexNo, radioSelected } = this.state;
    let options: any[] = [];
    if (questionList.length > 0) {
      let _opts = questionList[activeQuestionIndexNo].Options;
      if (_opts) {
        _opts.split(";").map((opt: string) => {
          options.push({ key: opt, text: opt });
        });
      }
    }
    return (
      <div id="mainDiv" contextMenu="return false">
        {this.state.summaryInfo == false ? (
          <Summary isExamStarted={this.handleCallback}></Summary>
        ) : (
          <>
            {this.state.checkTimeOut == false ? (
              <section>
                <h2>
                  Time left:{" "}
                  {this.state.time.m < 10
                    ? "0" + this.state.time.m
                    : this.state.time.m}
                  :
                  {this.state.time.s < 10
                    ? "0" + this.state.time.s
                    : this.state.time.s}
                </h2>
                <Stack horizontal>
                  <Stack.Item>
                    {
                      <PrimaryButton
                        text="QuestionSummery"
                        onClick={() => this.checkQuestionSummery()}
                      />
                    }
                  </Stack.Item>
                </Stack>
                <Stack tokens={tokens.sectionStack}>
                  {questionList.length > 0 && (
                    <>
                      <Stack.Item>
                        <Text variant={"large"} block>
                          {" "}
                          #{activeQuestionIndexNo + 1}{" "}
                        </Text>
                      </Stack.Item>
                      <Stack.Item>
                        <Text>
                          {questionList[activeQuestionIndexNo].Question}
                        </Text>
                      </Stack.Item>
                      <Stack.Item>
                        {questionList[activeQuestionIndexNo].QuestionType ===
                          QuestionType.TEXTBOX && (
                          <TextField
                            value={
                              questionList[activeQuestionIndexNo].Answer != ""
                                ? this.state.TextBox
                                : ""
                            }
                            onChange={(ev) => {
                              this.setTextBoxAnswer(activeQuestionIndexNo, ev);
                            }}
                            multiline
                          />
                        )}
                        {questionList[activeQuestionIndexNo].QuestionType ===
                          QuestionType.RADIOBUTTON && (
                          <ChoiceGroup
                            options={options}
                            onChange={(ev, option) => {
                              this.setAnswer(
                                activeQuestionIndexNo,
                                option.text
                              );
                            }}
                            selectedKey={
                              questionList[activeQuestionIndexNo].Answer != ""
                                ? radioSelected
                                : false
                            }
                          />
                        )}
                        {questionList[activeQuestionIndexNo].QuestionType ===
                          QuestionType.CHECKBOX &&
                          questionList[activeQuestionIndexNo].Options.split(
                            ";"
                          ).map(
                            (opt: string, index: number, array: string[]) => {
                              return (
                                <Checkbox
                                  label={opt}
                                  onChange={(ev, checked) => {
                                    this.setCheckboxAnswer(
                                      activeQuestionIndexNo,
                                      opt,
                                      checked
                                    );
                                  }}
                                  checked={
                                    Array.isArray(
                                      questionList[activeQuestionIndexNo].Answer
                                    ) &&
                                    questionList[
                                      activeQuestionIndexNo
                                    ].Answer.indexOf(opt) !== -1
                                      ? true
                                      : false
                                  }
                                />
                              );
                            }
                          )}
                      </Stack.Item>
                      <Stack horizontal>
                        <Stack.Item align="start">
                          {activeQuestionIndexNo >= 1 &&
                            this.state.checkTimeOut === false && (
                              <PrimaryButton
                                text="Previous"
                                onClick={() => {
                                  this.PreviousClick(activeQuestionIndexNo - 1);
                                }}
                              />
                            )}
                        </Stack.Item>
                        <Stack.Item style={{ padding: "0 0 0 50%" }}>
                          {activeQuestionIndexNo < questionList.length - 1 &&
                            this.state.checkTimeOut === false && (
                              <PrimaryButton
                                text="Next"
                                onClick={() =>
                                  this.saveUserAnswers(
                                    activeQuestionIndexNo + 1
                                  )
                                }
                              />
                            )}
                        </Stack.Item>
                      </Stack>
                      <Stack horizontal>
                        <Stack.Item align="start">
                          {activeQuestionIndexNo == questionList.length - 1 && (
                            <PrimaryButton
                              text="Exam Preview"
                              onClick={() => this.checkExamPreview()}
                            />
                          )}
                        </Stack.Item>
                        <Stack.Item style={{ padding: "0 0 0 50%" }}>
                          {activeQuestionIndexNo == questionList.length - 1 && (
                            <PrimaryButton
                              text="Submit"
                              onClick={() => this.checkScore()}
                            />
                          )}
                        </Stack.Item>
                      </Stack>

                      {this.state.questionSummaryData == true && (
                        <>
                          <QuestionSummary
                            CallbackQuestionNo={this.handleCallbackQuestionNo}
                            userData={this.state.questionList}
                          ></QuestionSummary>
                          <Stack horizontal>
                            <Stack.Item>
                              <PrimaryButton
                                text="Hide Questions Preview"
                                onClick={() => this.hideQuestionsPreview()}
                              />
                            </Stack.Item>
                          </Stack>
                        </>
                      )}

                      {/* <>
                      <CheckExamPreview userData={this.state.questionList}></CheckExamPreview>
                      
                      </> */}
                    </>
                  )}
                </Stack>
              </section>
            ) : (
              <ThankYou />
            )}
          </>
        )}
      </div>
    );
  }
}
