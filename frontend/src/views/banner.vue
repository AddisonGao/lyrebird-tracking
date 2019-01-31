<template>   
    <div class="button-bar">       
        <Tooltip content="Clear">
            <Button @click="clearResult" icon="md-refresh"></Button>
        </Tooltip>
        <div class="inline">
            <Divider type="vertical"></Divider>
        </div>
        <Tooltip content="Save Report">
            <Button @click="saveReport" icon="md-download"></Button>
        </Tooltip> 
    </div>
</template>

<script>
export default {
  name : 'Banner',
  methods: {
        clearResult: function() {
            this.$http.get('/ui/plugin/tracking/clear')
            .then(response=>{
                console.log('Clear statistics list!');
                this.$Notice.success({
                    title: "Clear Success"
                });
            })
        },
        saveReport: function() {
            this.$http.get('/ui/plugin/tracking/report')
            .then(response=>{
                this.$Notice.success({
                    title: "Save Success",
                    render: h => {
                        return h('span', {style:{wordBreak:'break-all'}},'Save to \n "~/.lyrebird/plugins/lyrebird_tracking/report"')
                    }
                });
            })
        }
    }
}

</script>

<style>
    .inline {
        display: inline;
    }
    .button-bar {
    flex-grow: 1
  }
</style>
