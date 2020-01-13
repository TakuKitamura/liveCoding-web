<template>
  <v-container>
    <!-- <div v-for="(value, name) in fileList" v-bind:key="name">
      {{ name }}
    </div> -->
    <!-- {{ selectFile }} -->
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
    <h2>ファイル内容</h2>
    <h3>
      <pre>{{ showFileContent }}</pre>
    </h3>
    --------------------------------
    <h2>CUIの内容</h2>
    <h3>
      <pre>{{ showCUIContent }}</pre>
    </h3>
    --------------------------------
    <v-slider
      v-model="id"
      :max="this.liveData !== null ? this.liveData.data.length - 1 : 0"
    ></v-slider>
    <v-btn @click="getLiveData()" depressed small>Play</v-btn>
  </v-container>
</template>

<style>
</style>

<script>
import { mapState, mapActions } from "vuex";

export default {
  components: {},

  data() {
    return {
      selectFile: 0,
      id: 0,
      fileContent: ""
    };
  },
  computed: {
    fileList: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }
      console.log(this.liveData.data[this.id]);
      const files = this.liveData.data[this.id].files;
      let fileList = [];
      for (let key in files) {
        console.log(key);
        if (key !== "test/cui.log") {
          fileList.push(key);
        }
      }

      return fileList.sort();
    },
    showFileContent: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }

      return this.liveData.data[this.id].files[this.fileList[this.selectFile]];
    },
    showCUIContent: function() {
      if (this.liveData === null || this.liveData.data[this.id] === undefined) {
        return "";
      }

      return this.liveData.data[this.id].files["test/cui.log"] || "";
    },
    ...mapState({
      liveData: state => state.liveStore.liveData
    })
  },
  created() {
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
