import axios from "axios";

const GET_LIVE_DATA = "get_live_data"

export const state = () => ({
  liveData: null
});

export const mutations = {
  [GET_LIVE_DATA](state, liveData) {
    state.liveData = liveData;
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
      "/api/live";

    try {
      let getLiveDataResponse = await axios.post(
        getLiveDataEndpoint, {
          id: id
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      action.commit(GET_LIVE_DATA, getLiveDataResponse);
    } catch {
      console.log("don't have data")
      action.commit(GET_LIVE_DATA, null);
    }
  },
};
