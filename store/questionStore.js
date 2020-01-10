import axios from "axios";

const ASK_QUESTION = "ask_question";
const ANSWER_QUESTION = "answer_question";

export const state = () => ({
  questionData: []
});

export const mutations = {
  [ASK_QUESTION](state, questionData) {
    state.questionData.push(questionData);
  },
  [ANSWER_QUESTION](state, questionData) {
    // state.questionData = questionData;
  }
};

export const actions = {
  async askQuestion(action, {
    userID,
    lang,
    seedValue
  }) {
    console.log(222);
    const askQuestionEndpoint =
      process.env.scheme +
      process.env.host +
      ":" +
      process.env.apiPort +
      "/api/question";

    try {
      let askQuestionResponse = await axios.post(
        askQuestionEndpoint, {
          userID: userID,
          value: seedValue,
          lang: lang
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      action.commit(ASK_QUESTION, askQuestionResponse);
    } catch {
      alert("学習がまだされていない場合の実装中");
      location.href = "/";
    }
  },
  async answerQuestion(action, {
    userID,
    questionID,
    questionNumber,
    questionAnserID,
    lang,
  }) {
    console.log(222);
    const askQuestionEndpoint =
      process.env.scheme +
      process.env.host +
      ":" +
      process.env.apiPort +
      "/api/question";
    try {
      let askQuestionResponse = await axios.post(
        askQuestionEndpoint, {
          userID: userID,
          questionID: questionID,
          questionNumber: questionNumber,
          questionAnswerID: questionAnserID,
          lang: lang
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      action.commit(ASK_QUESTION, askQuestionResponse);
    } catch {
      alert("学習がまだされていない場合の実装中");
      location.href = "/";
    }
  }
};
