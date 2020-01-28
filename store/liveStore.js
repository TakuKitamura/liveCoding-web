import axios from "axios";

const GET_LIVE_DATA = "get_live_data"
const GET_LIVE_LIST_DATA = "get_live_list_data"

export const state = () => ({
  liveData: null,
  liveListData: null
});

export const mutations = {
  [GET_LIVE_DATA](state, liveData) {
    state.liveData = liveData;
  },
  [GET_LIVE_LIST_DATA](state, liveListData) {
    state.liveListData = liveListData;
  }
};

export const actions = {
  async getLiveData(action, {
    id
  }) {
    // console.log(222);
    const getLiveDataEndpoint =
      process.env.scheme +
      process.env.host +
      ":" +
      process.env.apiPort +
      "/api/live?id=" + id;

    try {
      let getLiveDataResponse = await axios.post(
        getLiveDataEndpoint, {}, {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      action.commit(GET_LIVE_DATA, getLiveDataResponse);
    } catch (err) {
      console.log(err, 111)
    }
  },
  async getLiveListData(action, {
    projectPath
  }) {
    // console.log(222);
    const getLiveListDataEndpoint =
      process.env.scheme +
      process.env.host +
      ":" +
      process.env.apiPort +
      "/api/liveList";

    try {
      let getLiveListDataResponse = await axios.get(
        getLiveListDataEndpoint, {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      action.commit(GET_LIVE_LIST_DATA, getLiveListDataResponse);
    } catch (err) {
      console.log(err, 222)
    }
  },
};
