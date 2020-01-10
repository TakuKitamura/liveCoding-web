<template>
  <v-container>
    <!-- <v-row>
      <v-col> -->
    <v-card class="mx-auto">
      <v-card-title class="blue white--text">
        <span class="headline">Oborobot</span>

        <v-spacer></v-spacer>

        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <!-- <v-btn dark icon v-on="on"> -->
            <!-- <v-icon>mdi-dots-vertical</v-icon> -->
            <v-btn v-on="on" text color="white"> lang: {{ lang }} </v-btn>
            <!-- </v-btn> -->
          </template>

          <v-list>
            <v-list-item
              v-for="(item, i) in items"
              :key="i"
              @click="selectLang(item)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-text>
        <div v-if="questionState === 0">
          <v-text-field
            v-model="searchWords"
            v-on:keyup="checkInput"
            :label="lang === 'ja' ? '検索ワード' : 'SearchWords'"
          />
          <v-btn color="primary" @click="askQuestion()">{{
            lang === "ja" ? "検索" : "Search"
          }}</v-btn>
        </div>

        <div v-else-if="questionState === 1">
          <h4>
            {{
              questionData.data !== undefined
                ? "Question" +
                  questionData.data[questionData.data.length - 1]
                    .question_number
                : ""
            }}
          </h4>
          <h2>
            {{
              questionData.data !== undefined
                ? questionData.data[questionData.data.length - 1][
                    "question_" + lang
                  ]
                : ""
            }}
          </h2>
          <v-row>
            <v-col>
              <v-btn-toggle v-model="selectButtonValue" tile group>
                <v-btn
                  min-width="100px"
                  @click="nextQuestion(1)"
                  value="yes"
                  id="select-button"
                >
                  {{ lang === "ja" ? "はい" : "Yes" }}
                </v-btn>
                <v-btn
                  min-width="100px"
                  @click="nextQuestion(2)"
                  value="no"
                  id="select-button"
                >
                  {{ lang === "ja" ? "いいえ" : "No" }}
                </v-btn>
              </v-btn-toggle>
              <v-btn-toggle v-model="selectButtonValue" tile group>
                <v-btn
                  min-width="100px"
                  @click="nextQuestion(3)"
                  value="maybe yes"
                  id="select-button"
                >
                  {{ lang === "ja" ? "たぶんそう" : "Maybe Yes" }}
                </v-btn>
                <v-btn
                  min-width="100px"
                  @click="nextQuestion(4)"
                  value="maybe no"
                  id="select-button"
                >
                  {{ lang === "ja" ? "たぶんちがう" : "Maybe No" }}
                </v-btn>
              </v-btn-toggle>
              <v-btn-toggle v-model="selectButtonValue" tile group>
                <v-btn
                  min-width="100px"
                  @click="nextQuestion(5)"
                  value="don't know"
                  id="select-button"
                >
                  {{ lang === "ja" ? "わからない" : "Don't Know" }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <h4>
            {{
              lang === "ja"
                ? "あなたが探している記事はこれかもしれません｡"
                : "The article you are looking for could be this."
            }}
          </h4>
          <h3
            v-if="
              questionData.data[questionData.data.length - 1].title.length > 0
            "
          >
            <!-- {{ lang === "ja" ? "タイトル" : "Title" }}: -->
            [{{ questionData.data[questionData.data.length - 1].title }}]
          </h3>
          <h5
            v-if="
              questionData.data[questionData.data.length - 1].description
                .length > 0
            "
          >
            <!-- {{ lang === "ja" ? "概要" : "Description" }}: -->
            {{ questionData.data[questionData.data.length - 1].description }}...
          </h5>
          <h3>
            <a
              :href="questionData.data[questionData.data.length - 1].url"
              target="_blank"
              >{{ questionData.data[questionData.data.length - 1].url }}</a
            >
          </h3>
          <v-btn @click="questionRestart()">
            {{ lang === "ja" ? "もう一度検索 " : "Search Again" }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <!-- </v-col>
    </v-row> -->
    <!-- <h1>Oborobot</h1> -->
  </v-container>
</template>

<style>
#select-button {
  border: solid 1px #111111;
}
</style>

<script>
import { mapState, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      lang: "ja",
      items: [{ title: "日本語" }, { title: "English" }],
      questionState: 0,
      nowQuestionNumber: 0,
      selectButtonValue: null,
      searchWords: null
    };
  },
  computed: {
    ...mapState({
      questionData: state => state.questionStore.questionData
    })
  },
  created() {
    this.setQuery();
    const id = this.uuidVersion3();
    this.$cookies.set("ID", id, {
      path: "/",
      domain: "localhost"
    });
  },
  methods: {
    uuidVersion3(a) {
      return a
        ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
        : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
            /[018]/g,
            this.uuidVersion3
          );
    },
    selectLang(item) {
      if (item.title === this.items[0].title) {
        this.lang = "ja";
      } else if (item.title === this.items[1].title) {
        this.lang = "en";
      }
    },
    checkInput(input) {
      if (input.keyCode === 13) {
        // alert("Enter was pressed");
        this.askQuestion();
      }
    },
    setQuery() {
      this.searchWords = this.$route.query.q || "";
    },
    nextQuestion(questionAnswerID) {
      this.answerQuestion(questionAnswerID);
      this.nowQuestionNumber += 1;
      // if (this.questionData.data[questionData.data.length - 1].questions.length === this.nowQuestionNumber) {
      //   this.questionState = 2;
      // }
    },
    answerQuestion(questionAnswerID) {
      // alert(this.cookie);
      this.$store.dispatch("questionStore/answerQuestion", {
        userID: this.$cookies.get("ID"),
        questionID: this.questionData.data[questionData.data.length - 1]
          .questionID,
        questionNumber: this.nowQuestionNumber,
        questionAnswerID: questionAnswerID,
        lang: this.lang
      });
    },
    //     userID: userID,
    // questionID: questionID,
    // nowQuestionNumber: nowQuestionNumber,
    // questionAnswerID: questionAnserID,
    // lang: lang
    askQuestion() {
      if (this.searchWords.length > 0) {
        // console.log(111);
        this.$store.dispatch("questionStore/askQuestion", {
          userID: this.$cookies.get("ID"),
          questionID: questionID,
          lang: this.lang,
          seedValue: this.searchWords
        });
        this.questionState = 1;
        // console.log(555);
      }
    },
    questionRestart() {
      this.questionState = 0;
      this.nowQuestionNumber = 0;
      this.selectButtonValue = null;
      this.searchWords = null;
    },
    ...mapActions({
      // updateExcelType: "questionStore/updateExcelType"
    })
  }
};
</script>
