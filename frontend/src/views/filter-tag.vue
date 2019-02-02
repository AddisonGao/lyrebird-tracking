<template>
    <div v-if="allGroup.length!=0">
        <Tag >Case filters : {{grouplist.length}} conditions </Tag>
        <i-button icon="ios-create-outline" type="dashed" size="small" @click="editTag"> Edit </i-button>
        <modal v-model="showModal" title="Edit Tag" @on-ok="changeOk" height="auto" :mask="false" width="70vh">
          <i-select filterable class="custom-select" v-model="changeGroupCache" multiple style="width:260px,margin:auto;" @on-change="activatedDataChange">
            <option-group label="Group">
              <i-option v-for="item in allGroup" :key="item" :value="item">{{item}}</i-option>
            </option-group>
          </i-select>
          <div slot="footer">
            <i-button @click="clearFilter" style="margin:auto" class="clear-button">Clear All</i-button>
            <i-button type="text" @click="cancelmodel"> Cancel </i-button>
            <i-button type="primary"  @click="changeOk"> OK </i-button>
        </div>
        </modal>
    </div>
</template>

<script>
import * as api from '@/api'

export default {
  mounted: function() {
    this.loadTagList();
  },
  data: function() {
    return {
      grouplist: [],
      showModal: false,
      allGroup: [],
      changeGroupCache: []
    };
  },
  methods: {
    loadTagList: function() {
      let filterdata = null;
      api.loadTrackingBase()
      .then(response=>{
        filterdata = response.data;
        let group = [];
        for (let i = 0; i < filterdata.cases.length; i++) {
          let name = filterdata.cases[i].groupname;
          if (typeof name != "undefined") {
            // 如果grouplist里面不包含当前groupname返回-1，包含返回index值
            if (group == 0 || group.indexOf(name) == -1) {
              group.push(name);
            }
          }
        }
        // 初始化，展示list赋值展示全部，赋值给AllGroup
        this.allGroup = group;
      })
      .catch(error=>console.log(error))

      api.loadGroupList()
      .then(response=> {
        filterdata = response.data;
        this.grouplist = filterdata;
        this.changeGroupCache = filterdata;
        this.$store.dispatch('loadGroupList', this.grouplist);
      })
      .catch(error=>console.log(error))
    },
    changeOk: function() {
      this.grouplist = this.changeGroupCache;
      this.$store.dispatch('loadGroupList', this.grouplist);
      this.showModal = false;
    },
    activatedDataChange: function(val) {
      this.changeGroupCache = val;
    },
    clearFilter: function(){
      this.changeGroupCache = []
    },
    cancelmodel: function(){
      this.showModal = false;
    },
    editTag: function(){
      this.showModal = true;
      this.changeGroupCache = this.grouplist;
    }
  }
}
</script>
<style>
  .custom-select > .ivu-select-selection {
      max-height: 180px;
      overflow-y: scroll;
  }
  .clear-button {
    float: left;
  }
</style>
