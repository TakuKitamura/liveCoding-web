
<template>
  <v-container>
    {{ fileContents }}
    {{ commandsInAll }}
    ID: {{ id }}
    <v-slider
      thumb-label
      v-model="id"
      :max="this.liveData !== null ? this.liveData.data.length - 1 : 0"
    ></v-slider>
    <v-btn @click="getLiveData()" depressed small>Play</v-btn>
    <v-list-item-group v-model="selectFile" color="primary">
      <v-list-item v-for="(item, index) in fileList" v-bind:key="index">
        <!-- <v-list-item-icon>
        <v-icon v-text="item.icon"></v-icon>
      </v-list-item-icon> -->
        <v-list-item-content>
          <v-list-item-title v-text="item"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
    <h2>{{ showFileTitle }}</h2>
    <h3>
      <!-- <prism
        class="line-numbers"
        :language="selectFileLang"
        :code="showFileContent"
      /> -->
      <!-- <pre><code>{{ showFileContent }}</code></pre> -->
      <pre><code id="fileContent" v-html="showFileContent"></code></pre>
    </h3>
    <h2>CUIアクティビティ</h2>
    <h3>
      <pre><code id="cuiContent" v-html="showCUIContent"></code></pre>
      <!-- <pre><code v-html="showCUIContent"></code></pre> -->
    </h3>
  </v-container>
</template>

<style>
#fileContent,
#cuiContent {
  padding: 1em;
  color: #abb2bf;
  background: #282c34;
  font-size: 1.5em;
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import hljs from "highlight.js/lib/highlight";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";
import plaintext from "highlight.js/lib/languages/plaintext";
import "highlight.js/styles/atom-one-dark.css";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("python", python);
hljs.registerLanguage("plaintext", plaintext);

export default {
  components: {},
  data() {
    return {
      selectFile: 0,
      id: 0,
      fileContents: {}
    };
  },
  mounted() {
    // import abc from "highlightjs-line-numbers.js/src/highlightjs-line-numbers.js";
    // abc.initHighlightingOnLoad();
    // abc.initLineNumbersOnLoad();
    // console.log(abc);
  },
  computed: {
    allFileContents: function() {
      let allFileContents = [];
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }
      for (let i = 0; i < this.liveData.data.length; i++) {
        const element = this.liveData.data[i];
        allFileContents.push(element);
        // console.log(element);
      }
      return allFileContents;
    },
    commandsInAll: function() {
      let commandsInAll = {};
      for (let id = 0; id < this.allFileContents.length; id++) {
        const element = this.allFileContents[id];
        const files = element.files;
        for (const [path, code] of Object.entries(files)) {
          const lang = this.judgeFileLang(path);
          const command = this.getCommands(this.commandsList, lang, code);
          if (command === null) {
            continue;
          }
          commandsInAll[id] = command;
        }
        // console.log(files);
      }
      return commandsInAll;
    },
    commandsList: function() {
      return ["content"];
    },
    fileList: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }
      // console.log(this.liveData.data[this.id]);
      const files = this.liveData.data[this.id].files;
      let fileList = [];
      for (let key in files) {
        // console.log(key);
        if (key !== "test/cui.log") {
          fileList.push(key);
        }
      }

      return fileList.sort();
    },
    showFileContent: function() {
      if (
        this.liveData === null ||
        this.liveData.data[this.id] === undefined ||
        this.selectFile === undefined ||
        this.fileList[this.selectFile] === undefined
      ) {
        return "";
      }

      const path = this.fileList[this.selectFile];

      const lang = this.judgeFileLang(path);

      for (const [key, value] of Object.entries(
        this.liveData.data[this.id].files
      )) {
        this.fileContents[key] = value;
      }
      const fileContent = this.fileContents[this.fileList[this.selectFile]];

      // let commands = this.getCommands(
      //   this.commandsList,
      //   this.selectFileLang,
      //   fileContent
      // );

      // if (commands !== null) {
      //   // console.log(777)
      // }

      const highlighted = hljs.highlight(lang, fileContent).value;
      return highlighted;
    },
    showCUIContent: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }

      // console.log(this.liveData.data[this.id].files["test/cui.log"], 987);

      if (this.liveData.data[this.id].files["test/cui.log"] === undefined) {
        return "";
      }

      const cuiContent = this.liveData.data[this.id].files["test/cui.log"];

      const highlighted = hljs.highlight("bash", cuiContent).value;
      return highlighted;
    },
    showFileTitle: function() {
      if (this.fileList[this.selectFile] === undefined) {
        return "ファイル選択なし";
      }
      const splitSlash = this.fileList[this.selectFile].split("/");
      return splitSlash[splitSlash.length - 1];
    },
    ...mapState({
      liveData: state => state.liveStore.liveData
    })
  },
  created() {
    this.getLiveData();
  },
  methods: {
    getLiveData() {
      this.$store.dispatch("liveStore/getLiveData", {
        // id: this.id
      });
    },
    judgeFileLang(path) {
      let splitDot = path.split(".");
      if (splitDot.length === 1) {
        return "plaintext";
      } else {
        let fileExtention = splitDot[splitDot.length - 1].toLowerCase();
        if (fileExtention === "py") {
          return "python";
        } else {
          return "plaintext";
        }
      }
    },
    play() {
      // setInterval(() => {
      //   this.$store.dispatch("liveStore/getLiveData", {
      //     id: this.id
      //   });
      //   this.id++;
      //   if (this.liveData === null) {
      //     this.id = 1;
      //   }
      // }, 500);
    },
    getCommands(commnadsList, lang, code) {
      const splitCode = code.split("\n");

      let commentMark = "";
      if (lang === "python" || lang === "bash") {
        commentMark = "#";
      } else if (lang === "javascript" || lang === "go" || lang === "c") {
        commentMark = "//";
      } else if (lang === "html") {
        commentMark = "<!--";
      } else {
        return null;
      }

      const commandMark = commentMark + "@";

      let commandsObject = {};

      let haveCommand = false;
      for (let i = 0; i < commnadsList.length; i++) {
        const command = commnadsList[i];
        commandsObject[command] = "";
      }

      for (let i = 0; i < splitCode.length; i++) {
        const line = splitCode[i];
        if (line.indexOf(commandMark) !== -1) {
          const splitCommand = line.split(commandMark);
          if (splitCommand.length !== 2) {
            //   console.log(111)
            continue;
          }

          try {
            commands = JSON.parse(splitCommand[1]);
          } catch {
            //   console.log(222)
            continue;
          }

          // console.log(commands)
          for (const [key, value] of Object.entries(commands)) {
            // 存在する
            if (Object.keys(commandsObject).indexOf(key) >= 0) {
              commandsObject[key] = value;
              haveCommand = true;
            }
          }
        }
      }

      if (haveCommand === false) {
        return null;
      }

      return commandsObject;
    },
    ...mapActions({
      // updateExcelType: "questionStore/updateExcelType"
    })
  }
};
</script>
