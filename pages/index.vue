<template>
  <v-container>
    <!-- {{ showLiveList }} -->
    <br />
    <!-- <div>目次: {{ this.commandsInAll[this.id] }}</div> -->
    <h2>現在の見出し</h2>
    <div v-for="(value, name) in this.commandsInAll[this.id]" v-bind:key="name">
      <span>
        <div v-if="value.content.length > 0">
          <h3>{{ name.split("/")[name.split("/").length - 1] }}</h3>
          <h4>見出し: {{ value.content }}</h4>
        </div>
      </span>
    </div>
    <v-slider
      thumb-label
      v-model="id"
      :max="this.liveData !== null ? this.liveData.data.length - 1 : 0"
    ></v-slider>
    <v-btn @click="getLiveData()" depressed small>Play</v-btn>
    <v-list-item-group v-model="selectFile" color="primary">
      <v-list-item v-for="(item, index) in fileList" v-bind:key="index">
        <v-list-item-content>
          <v-list-item-title v-text="item"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>

    <h2>{{ showFileTitle }}</h2>
    <h3>
      <pre><code id="fileContent" v-bind:file-content-line-number="fileContentLineNumber" v-html="showFileContent"></code></pre>
    </h3>
    <h2>CUIアクティビティ</h2>
    <h3>
      <pre><code id="cuiContent" v-bind:cui-content-line-number="cuiContentLineNumber" v-html="showCUIContent"></code></pre>
    </h3>
    {{ this.liveData }}
    <!-- <div>ID: {{ id }}</div>
    <div>目次: {{ this.commandsInAll }}</div>
    <v-slider
      thumb-label
      v-model="id"
      :max="this.liveData !== null ? this.liveData.data.length - 1 : 0"
    ></v-slider>
    <v-btn @click="getLiveData()" depressed small>Play</v-btn>
    <v-list-item-group v-model="selectFile" color="primary">
      <v-list-item v-for="(item, index) in fileList" v-bind:key="index">
        <v-list-item-content>
          <v-list-item-title v-text="item"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
    <h2>{{ showFileTitle }}</h2>
    <h3>
      <pre><code id="fileContent" v-html="showFileContent"></code></pre>
    </h3>
    <h2>CUIアクティビティ</h2>
    <h3>
      <pre><code id="cuiContent" v-html="showCUIContent"></code></pre>
    </h3> -->
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
pre {
  border: none;
  padding: 0;
  position: relative;
}
#fileContent {
  display: block;
  padding: 0.5em 1em 0.5em 3em;
  counter-reset: line;
}
#fileContent::before {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  white-space: pre;
  display: block;
  padding: 0.5em 0em 0.5em 0em;
  width: 3em;
  box-sizing: border-box;
  color: #777;
  text-align: center;
  content: attr(file-content-line-number);
}
#cuiContent {
  display: block;
  padding: 0.5em 1em 0.5em 3em;
  counter-reset: line;
}
#cuiContent::before {
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  white-space: pre;
  display: block;
  padding: 0.5em 0em 0.5em 0em;
  width: 3em;
  box-sizing: border-box;
  color: #777;
  text-align: center;
  content: attr(cui-content-line-number);
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import hljs from "highlight.js/lib/highlight";
import shell from "highlight.js/lib/languages/shell";
import python from "highlight.js/lib/languages/python";
import plaintext from "highlight.js/lib/languages/plaintext";
import "highlight.js/styles/atom-one-dark.css";

hljs.registerLanguage("shell", shell);
hljs.registerLanguage("python", python);
hljs.registerLanguage("plaintext", plaintext);

export default {
  components: {},
  data() {
    return {
      selectFile: 0,
      id: 0,
      fileContents: {},
      cuiContentLineNumber: "",
      fileContentLineNumber: ""
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
    showCommandContent: function() {},
    commandsInAll: function() {
      let commandsInAll = {};
      for (let id = 0; id < this.allFileContents.length; id++) {
        const element = this.allFileContents[id];
        const files = element.files;
        // console.log(element, 111)
        // console.log(files, 222)
        let fileObj = {};
        for (const [filePath, fileValue] of Object.entries(files)) {
          // console.log(file, fileValue);
          const commands = fileValue.commands;
          fileObj[filePath] = commands;
          // console.log(filePath, commands);
          // fileObj.push({ filepath: commands });
          // const lang = this.judgeFileLang(path);
          // const command = this.getCommands(this.commandsList, lang, code);
          // if (command === null) {
          //   continue;
          // }
        }
        commandsInAll[id] = fileObj;
        // console.log(commandsInAll);
      }
      // commandsInAll = { 30: { content: "TestTest" } };
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
        if (key !== this.liveData.data[this.id].projectPath + "/.cui.log") {
          fileList.push(
            key
            // key.replace(
            //   this.liveData.data[this.id].projectPath,
            //   this.liveData.data[this.id].projectName
            // )
          );
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
      // console.log(path, 1111111);

      const lang = "plaintext";

      for (const [key, value] of Object.entries(
        this.liveData.data[this.id].files
      )) {
        this.fileContents[key] = value;
      }
      const fileContent = this.fileContents[this.fileList[this.selectFile]];
      console.log(fileContent, 111);

      // let commands = this.getCommands(
      //   this.commandsList,
      //   this.selectFileLang,
      //   fileContent
      // );

      // if (commands !== null) {
      //   // console.log(777)
      // }

      const lineNumber = fileContent.code.split("\n").length;

      let fileContentLineNumber = "";

      for (let i = 0; i < lineNumber; i++) {
        fileContentLineNumber += String(i + 1) + "\n";
      }

      this.fileContentLineNumber = fileContentLineNumber;

      const highlighted = hljs.highlight(fileContent.lang, fileContent.code)
        .value;
      return highlighted;
      // return;
    },
    showCUIContent: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }

      // console.log(this.liveData.data[this.id].files["test/cui.log"], 987);

      const cuiLogPath = this.liveData.data[this.id].projectPath + "/.cui.log";
      // console.log(
      //   this.liveData.data[this.id].files[
      //     this.liveData.data[this.id].projectPath + "/.cui.log"
      //   ],
      //   999
      // );

      if (cuiLogPath === undefined) {
        return "";
      }

      let cuiContent = this.liveData.data[this.id].files[cuiLogPath].code.slice(
        0,
        -1
      );

      const lineNumber = cuiContent.split("\n").length;

      let cuiContentLineNumber = "";

      for (let i = 0; i < lineNumber; i++) {
        cuiContentLineNumber += String(i + 1) + "\n";
      }

      this.cuiContentLineNumber = cuiContentLineNumber;

      const highlighted = hljs.highlight("shell", cuiContent).value;

      return highlighted;
    },
    showFileTitle: function() {
      if (this.fileList[this.selectFile] === undefined) {
        return "ファイル選択なし";
      }
      const splitSlash = this.fileList[this.selectFile].split("/");
      return splitSlash[splitSlash.length - 1];
    },
    showLiveList: function() {
      return this.liveListData;
    },
    ...mapState({
      liveData: state => state.liveStore.liveData,
      liveListData: state => state.liveStore.liveListData
    })
  },
  created() {
    this.getLiveData();
    this.getLiveListData();
  },
  methods: {
    getLiveData() {
      this.$store.dispatch("liveStore/getLiveData", {
        // id: this.id
      });
    },
    getLiveListData() {
      this.$store.dispatch("liveStore/getLiveListData", {
        // projectPath: this.id
      });
    },
    ...mapActions({
      // updateExcelType: "questionStore/updateExcelType"
    })
  }
};
</script>
