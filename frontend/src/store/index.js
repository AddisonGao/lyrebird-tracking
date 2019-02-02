import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '@/api' 

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    focusedTrackingDetail: null,
    trackingList: [],
    groupList: []
  },
  mutations: {
    setFocusedTrackingDetail(state, trackingDetail){
      state.focusedTrackingDetail = trackingDetail
    },
    setTrackingList(state, trackingList){
      state.trackingList = trackingList
    },
    setGroupList(state, groupList){
      state.groupList= groupList;
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
    },
    loadGroupList({commit}, grouplist){
      api.createGroupList(grouplist)
      .then(response=>{
        console.log('change selected group ok');
        commit('setGroupList', grouplist)
      })
      .catch(error=>console.log(error))
    }
  }
})