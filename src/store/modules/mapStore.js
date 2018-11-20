export default {
  namespaced: true,

  state: {
    map: null,
  },

  mutations: {
    SET_MAP(state, payload) {
      state.map = payload.map;
    },
  },
};
