<template>
  <v-container>
    <v-slider
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
        :language="selectFileType"
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
      selectFileType: "markup",
      id: 0,
      fileContent: ""
    };
  },
  mounted() {
    // import abc from "highlightjs-line-numbers.js/src/highlightjs-line-numbers.js";
    // abc.initHighlightingOnLoad();
    // abc.initLineNumbersOnLoad();
    // console.log(abc);
  },
  computed: {
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

      // console.log(this.fileList, this.selectFile);
      let splitDot = this.fileList[this.selectFile].split(".");
      if (splitDot.length === 1) {
        this.selectFileType = "plaintext";
      } else {
        let fileExtention = splitDot[splitDot.length - 1].toLowerCase();
        if (fileExtention === "py") {
          this.selectFileType = "python";
        } else {
          this.selectFileType = "plaintext";
        }
      }
      const fileContent = this.liveData.data[this.id].files[
        this.fileList[this.selectFile]
      ];

      const highlighted = hljs.highlight(this.selectFileType, fileContent)
        .value;
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
    // marked.setOptions({
    //   // code要素にdefaultで付くlangage-を削除
    //   langPrefix: "",
    //   // highlightjsを使用したハイライト処理を追加
    //   highlight: function(code, lang) {
    //     return hljs.highlightAuto(code, [lang]).value;
    //   }
    // });
    this.$store.dispatch("liveStore/getLiveData", {});
  },
  methods: {
    getLiveData() {
      this.$store.dispatch("liveStore/getLiveData", {
        // id: this.id
      });
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
    ...mapActions({
      // updateExcelType: "questionStore/updateExcelType"
    })
  }
};
</script>
