import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nodename: "",
    nodeip: "",
    nodetype: "",
    selectedTerminal: null,
    terminalInfo: {
      '北京接入点': {
        name: '北京接入点',
        url: 'http://59.110.238.62:1010'
      },
      '海南接入点': {
        name: '海南接入点',
        url: 'https://api.example.com/hainan'
      }
    }
  },
  getters: {
    getSelectedTerminal: state => state.selectedTerminal,
    getTerminalInfo: state => state.terminalInfo
  },
  mutations: {
    setSelectedTerminal(state, terminal) {
      state.selectedTerminal = terminal;
    }
  },
  actions: {
    updateSelectedTerminal({ commit }, terminal) {
      commit('setSelectedTerminal', terminal);
    }
  },
  modules: {},
})