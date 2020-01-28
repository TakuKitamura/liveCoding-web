<template>
  <div style="margin: 1%">
    <!-- <h1>現在の見出し</h1> -->
    <div v-for="(value, name) in this.commandsInAll[this.id]" v-bind:key="name">
      <span>
        <div v-if="value.content.length > 0">
          <h3>{{ name.split("/")[name.split("/").length - 1] }}</h3>
          <h4>見出し: {{ value.content }}</h4>
        </div>
      </span>
    </div>

    <!-- <v-btn @click="getLiveData()" depressed small>Play</v-btn> -->
    <div class="d-flex justify-space-between">
      <v-list width="20%" class="ma-1" style="background:rgba(0,0,0,0.0)">
        <v-subheader>{{ showProjectName.toUpperCase() }}</v-subheader>
        <v-list-item-group v-model="selectFile" color="primary">
          <v-list-item v-for="(item, index) in fileList" v-bind:key="index">
            <v-list-item-content>
              <v-list-item-title>
                <!-- {{
                item.split("/" + showProjectName + "/")[
                  item.split("/" + showProjectName + "/").length - 1
                ]
              }} -->
                {{ item.replace(showProjectName + "/", "") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <span style="width:50%">
        CODE
        <pre class="ma-1"><code id="fileContent"
      v-bind:file-content-line-number="this.selectFile === undefined ? '' : fileContentLineNumber" v-html="this.selectFile === undefined ? 'ファイル未選択': showFileContent"></code></pre>
      </span>
      <span style="width:30%">
        CUI
        <pre
          class="ma-1"
        ><code id="cuiContent" v-bind:cui-content-line-number="cuiContentLineNumber" v-html="showCUIContent"></code></pre>
      </span>
    </div>
    <div v-html="$md.render(showREADME)"></div>
    <div id="player">
      <!-- <template v-slot:append> -->
      <div v-if="this.youtubeURL.length !== 0">
        <iframe
          :hidden="isYouTubeHidden"
          type="text/html"
          width="640"
          height="360"
          src="https://www.youtube.com/embed/M7lc1UVf-VE"
          frameborder="0"
        ></iframe>
        <div>
          <v-btn
            v-if="isYouTubeHidden === false"
            @click="youTubeHidden()"
            depressed
            small
            >動画を隠す</v-btn
          >
          <v-btn v-else @click="youTubeShow()" depressed small
            >動画表示する</v-btn
          >
        </div>
      </div>
      <v-slider
        v-model="id"
        color="red accent-4"
        track-color="grey lighten-1"
        thumb-label="always"
        dense
        height="100"
        thumb-size="30"
        label="ID"
        :max="this.liveData !== null ? this.liveData.data.length - 1 : 0"
        ticks
      >
        <template v-slot:append>
          <v-text-field
            v-model="id"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 80px; font-size:1.5em"
            background-color="blue-grey lighten-4"
            outlined
            dense
          ></v-text-field>
        </template>
      </v-slider>
    </div>

    <!-- <h2>{{ showFiconstitle }}</h2>
    <h3>
      <pre><code id="fileContent" v-bind:file-content-line-number="fileContentLineNumber" v-html="showFileContent"></code></pre>
    </h3>
    <h2>CUIアクティビティ</h2>
    <h3>
      <pre><code id="cuiContent" v-bind:cui-content-line-number="cuiContentLineNumber" v-html="showCUIContent"></code></pre>
    </h3>
    {{ this.liveData }} -->
  </div>
</template>

<style>
html {
  font-size: 1em;
}

#player {
  position: fixed;
  bottom: 0;
  /* left: 10px; */
  width: 95%;
  /* background: #282c34; */
}

#fileContent {
  padding: 1em;
  color: #abb2bf;
  background: #282c34;
  font-size: 1em;
  word-wrap: break-word;
}

#cuiContent {
  padding: 1em;
  color: #abb2bf;
  background: #282c34;
  font-size: 1em;
  word-wrap: break-word;
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
  /* padding: 0.5em 1em 0.5em 3em; */
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
  /* content: attr(cui-content-line-number); */
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import hljs from "highlight.js/lib/highlight";
import shell from "highlight.js/lib/languages/shell";
import python from "highlight.js/lib/languages/python";
import plaintext from "highlight.js/lib/languages/plaintext";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/atom-one-dark.css";

hljs.registerLanguage("shell", shell);
hljs.registerLanguage("python", python);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("xml", xml);

export default {
  components: {},
  data() {
    return {
      selectFile: 0,
      id: 0,
      fileContents: {},
      cuiContentLineNumber: "",
      fileContentLineNumber: "",
      isYouTubeHidden: false,
      youtubeURL: ''
    };
  },
  mounted() {},
  computed: {
    allFileContents: function() {
      let allFileContents = [];
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }
      for (let i = 0; i < this.liveData.data.length; i++) {
        const element = this.liveData.data[i];
        allFileContents.push(element);
      }
      return allFileContents;
    },
    showProjectName: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }
      return this.liveData.data[this.id].projectName;
    },
    showCommandContent: function() {},
    commandsInAll: function() {
      let commandsInAll = {};
      for (let id = 0; id < this.allFileContents.length; id++) {
        const element = this.allFileContents[id];
        const files = element.files;
        let fileObj = {};
        for (const [filePath, fileValue] of Object.entries(files)) {
          const commands = fileValue.commands;
          fileObj[filePath] = commands;
        }
        commandsInAll[id] = fileObj;
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
        if (
          key !== this.liveData.data[this.id].projectName + "/.cui.log" &&
          key !== this.liveData.data[this.id].projectName + "/README"
        ) {
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

      // let beforeFileContent = "";
      // if (this.id >= 1) {
      //   let beforeFileContents = {};
      //   for (const [key, value] of Object.entries(
      //     this.liveData.data[this.id - 1].files
      //   )) {
      //     beforeFileContents[key] = value;
      //   }
      //   beforeFileContent = beforeFileContents[this.fileList[this.selectFile]];
      // }

      for (const [key, value] of Object.entries(
        this.liveData.data[this.id].files
      )) {
        this.fileContents[key] = value;
      }
      const fileContent = this.fileContents[this.fileList[this.selectFile]];

      // console.log("before", beforeFileContent.code, "after", fileContent.code);

      const fileContentCodeSplit = fileContent.code.split("\n");

      const lineNumber = fileContentCodeSplit.length;

      let fileContentLineNumber = "";

      for (let i = 0; i < lineNumber; i++) {
        fileContentLineNumber += String(i + 1) + "\n";
      }

      this.fileContentLineNumber = fileContentLineNumber;
      console.log(fileContent.lang);
      const highlighted = hljs.highlight(fileContent.lang, fileContent.code)
        .value;
      return highlighted;
    },
    showCUIContent: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }

      const cuiLogPath = this.liveData.data[this.id].projectName + "/.cui.log";

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
    showREADME: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }
      const readmePath = this.liveData.data[this.id].projectName + "/README";

      const readme = this.liveData.data[this.id].files[readmePath];

      if (readme === undefined) {
        return "";
      }
      const readmeContent = readme.code;
      return readmeContent;
    },
    ...mapState({
      liveData: state => state.liveStore.liveData,
      liveListData: state => state.liveStore.liveListData
    })
  },
  created() {
    const queryID = this.$route.query.id;
    console.log(queryID);
    const youtubeURL = this.$route.query.youtube_url
    console.log(youtubeURL)
    if (youtubeURL !== undefined) {
      this.youtubeURL = youtubeURL
    }

    if (queryID !== undefined) {
      this.getLiveData(queryID);
    }

    // this.getLiveListData();
  },
  methods: {
    getLiveData(id) {
      this.$store.dispatch("liveStore/getLiveData", {
        id: id
      });
    },
    getLiveListData() {
      this.$store.dispatch("liveStore/getLiveListData", {
        // projectPath: this.id
      });
    },
    youTubeShow() {
      this.isYouTubeHidden = false;
    },
    youTubeHidden() {
      this.isYouTubeHidden = true;
    },
    ...mapActions({
      // updateExcelType: "questionStore/updateExcelType"
    })
  }
};
</script>
