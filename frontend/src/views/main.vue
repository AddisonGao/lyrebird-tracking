<template>
    <div>
        <Row class="button-bar">
          <banner></banner>
        </Row>
        <div class="divider"></div>
        <Row>
            <Col span="12">
                <tracking-list :trackingdata="allTrackingData" class="tracking-left"></tracking-list>
            </Col>
            <div class="split" v-if="currentTracking"></div>
            <Col span="12" v-if="currentTracking">
                <tracking-detail class="tracking-right"></tracking-detail>
            </Col>
        </Row>
    </div>
</template>

<script>
import Banner from '@/views/banner.vue'
import TrackingList from '@/views/tracking-list.vue'
import TrackingDetail from '@/views/tracking-detail.vue'
import io from 'socket.io-client'
import * as api from '@/api' 

//websocket namespace /tracking-plugin
let trackingIO = io("/tracking-plugin");

export default {
  name : 'Tracking',
  components: {
    Banner,
    TrackingList,
    TrackingDetail
  },
  data: function () {
    return {
      allTrackingData: [],
      showedTrackingData: []
    }
  },
  mounted: function() {
    // this.$store.dispatch('loadTrackingList');
    this.loadTrackingList();
    const loadTrackingList = this.loadTrackingList;
    trackingIO.on("update", function(msg) {
      loadTrackingList();
      //this.$store.dispatch('loadTrackingList');
      console.log("update");
    });
  },
  computed: {
    currentTracking() {
      return this.$store.state.focusedTrackingDetail
    }
  },
  methods: {
    loadTrackingList: function() {
      api.loadTrackingList()
      .then(response=>{
        this.allTrackingData = response.data.result;
      })
      .catch(error=>console.log(error))
    }
  }
}

</script>

<style scoped>
  .button-bar {
      height: 38px;
      display: flex;
      align-items: center;
    }

  .tracking-left {
    margin-right: 5px;
  }

  .tracking-right {
    margin-left: 5px;
  }
  .divider{
    display: block;
    width: 100%;
    height: 1px;
    background: #eee;
    top: 0;
    left: 0;
  }
  .split{
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    border: 1px dashed #eee;
  }
</style>
