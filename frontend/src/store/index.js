import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '@/api' 

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    focusedTrackingDetail: null,
    trackingList: null
  },
  mutations: {
    setFocusedTrackingDetail(state, trackingDetail){
      state.focusedTrackingDetail = trackingDetail
    },
    setTrackingList(state, trackingList){
      state.trackingList = trackingList
    }
  },
  actions: {
    loadTrackingDetail({commit}, contentId){
      api.viewDetail(contentId)
      .then(response=>{
        commit('setFocusedTrackingDetail' , response.data)
      })
    },
    loadTrackingList({commit}){
      api.loadTrackingList()
      .then(response=>{
        commit('setTrackingList', response.data.result)
      })
    }
  }
})