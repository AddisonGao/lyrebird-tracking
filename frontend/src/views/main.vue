<template>
    <div>
        <Row class="button-bar">
          <banner></banner>
        </Row>
        <div class="divider"></div>
        <Row>
            <Col span="12">
                <tracking-list :trackingdata="allTrackingData"  @detail="getTrackingIndex" @content="getCurrentContent" class="tracking-left"></tracking-list>
            </Col>
            <div class="split" v-if="currentTracking"></div>
            <Col span="12" v-if="currentTracking">
                <tracking-detail :trackingdetail="currentTracking" :trackingindex="currentIndex" :currentcontent="currentContent" :codedetail="codedetail" class="tracking-right"></tracking-detail>
            </Col>
        </Row>
    </div>
</template>

<script>
import Banner from '@/views/banner.vue'
import TrackingList from '@/views/tracking-list.vue'
import TrackingDetail from '@/views/tracking-detail.vue'
import io from 'socket.io-client'

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
      showedTrackingData: [],
      currentIndex: null,
      currentTracking: null,
      targetContext: null,
      currentContent: {},
      codedetail: null
    }
  },
  mounted: function() {
    this.loadTrackingList();
    const loadTrackingList = this.loadTrackingList;
    trackingIO.on("update", function(msg) {
      loadTrackingList();
      console.log("update");
    });
  },
  methods: {
    getTrackingIndex: function(data, index) {
      this.currentTracking = data;
      this.currentIndex = index;
    },
    getCurrentContent: function(data) {
      this.currentContent = data;
      this.codedetail = data.content;
    },
    loadTrackingList: function() {
      this.$http.get("/ui/plugin/tracking/result").then(
        response => {
          this.allTrackingData = response.data.result;
        },
        error => {
          console.log("load tracking list failed!", error);
        }
      );
    },
    loadTrackingBase: function() {
      this.$http.get("/ui/plugin/tracking/init").then(response => {
        console.log("init msg successed");
        this.loadTrackingList();
      });
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
