<template>
  <div class="tracking-list">
    <filter-tag class="filter-bar"></filter-tag>
    <i-table v-if="displayedData" highlight-row :columns="columns" :data="displayedData" @on-row-click="handleRowSelect" class="data-table"></i-table>
  </div>
</template>

<script>
import FilterTag from '@/views/filter-tag.vue'
import * as api from '@/api'

export default {
  name : 'TrackingList',
  components: {
    FilterTag
  },
  props: [],
  data: function() {
    return {
      filter_rules: [],
      columns: [
        {
          title: "Case",
          key: "name",
          sortable: true
        },
        {
          title: "Result",
          key: "result",
          width: 100,
          sortable: true,
          render: (h, params) => {
            if (params.row.result === "pass") {
              return h(
                "i-button",
                {
                  props: { size: "small", type: "success" },
                  style: { width: "50px" }
                },
                "Pass"
              );
            } else if (params.row.result === "fail") {
              return h(
                "i-button",
                {
                  props: { size: "small", type: "error" },
                  style: { width: "50px" }
                },
                "Fail"
              );
            } else {
              return h(
                "i-button",
                {
                  props: { size: "small", type: "default"},
                  style: { width: "50px" }
                },
                "N/A"
              );
            }
          }
        }
      ]
    };
  },
  methods: {
    handleRowSelect: function(row, index) {
      this.$store.dispatch('loadTrackingDetail', row.id);
    }
  },
  computed: {
    allTrackingData() {
      return this.$store.state.trackingList;
    },
    groupList() {
      return this.$store.state.groupList;
    },
    displayedData() {
      const trackingList = this.allTrackingData;
      const groupList = this.groupList;
      let showdata = [];
      for (let i = 0; i < groupList.length; i++) {
        let filter_rule = groupList[i];
        let filtercells = trackingList.filter(function(elem) {
          return elem.groupname == filter_rule;
        });
        showdata = showdata.concat(filtercells);
      }
      return showdata;
    },
  }
}
</script>

<style>
.data-table th div{
padding-left: 5px;
padding-right: 5px;
}
.data-table td div{
padding-left: 5px;
padding-right: 5px;
}
.tracking-list {
  height: calc(100vh - 80px);
  overflow-y: auto;
}
.filter-bar {
  height: 30px;
  display: flex;
  align-items: center;
}

</style>
