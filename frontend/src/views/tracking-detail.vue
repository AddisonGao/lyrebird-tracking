<template>
  <div class="tracking-detail">
    <font style="font-size: 16px; font-weight: bold; color: rgb(70, 76, 91);" class="detail-title">Detail</font>
    <Collapse>
      <Panel v-for="item in currentcontent.asserts" :key="item.field">
        <font color="LimeGreen" v-if="item.flag===true">Check field - {{item.field}} </font>
        <font color="CornflowerBlue" v-else-if="item.flag===2||typeof(item.flag) == 'undefined'">Check field - {{item.field}} </font>
        <font color="red" v-else>Check field - {{item.field}} </font>
      <div slot="content">
        <!-- 没有期望值-展示文案提示 -->
        <li>Field : {{item.field}}</li>
        <li v-if="JSON.stringify(item.schema)=='{}'">Expect schema : 
          No expected value
        </li>
        <!-- 测试过场景-取expect参数 -->
        <li v-else>Expect schema :
          <div v-html="jsoninfo(item.schema)"></div>
        </li>
        <li>Actual value : 
          <div v-if="item.actual" v-html="jsoninfo(item.actual)"></div>
          <!-- 未测试过场景-实际值不存在展示NA -->
          <div v-else v-html="jsoninfo('N/A')"></div>
        </li>
      </div>
      </Panel>
    </Collapse>
    <br/>
    <div ref="container" style="height:500px;border:1px solid grey">
    </div>
  </div>
</template>

<script>
import Prism from 'prismjs'
import * as monaco from 'monaco-editor'

export default {
  name: 'TrackingDetail',
  props: ["trackingdetail", "trackingindex", "currentcontent", "codedetail"],
  computed: {
  },
  components: {
    Prism
  },
  updated: function() {
    Prism.highlightAll();
  },
  mounted: function() {
    Prism.highlightAll();
    //create monaco editor
    const editorContainer = this.$refs.container;
    const option = {
      value: JSON.stringify(this.codedetail, null, 4),
      language: "json",
      theme: "vs",
      glyphMargin: true,
      readOnly: true
    };
    this.editor = monaco.editor.create(editorContainer, option);
    //hover register
    const showhint = this.showhint
    monaco.languages.register({ id: 'json' });
    monaco.languages.registerHoverProvider('json', {
      provideHover: function(model,position) {
        return showhint(model,position)
      }
    });
  },
  data: function() {
    return {
      editor: null,
      match_array:[]
    };
  },
  methods: {
    jsoninfo: function(content) {
      const infoStr = JSON.stringify(content, null, 4);
      return '<pre><code class="language-json">' + infoStr + "</code></pre>"
    },
    showhint: function(model,position){
        let line = position.lineNumber;
        let field = null;
        let hint = null;
        for(var i=0;i<this.match_array.length;i++){
          if(this.match_array[i].linenumber===line){
            field = this.match_array[i].linenumber;
            hint = JSON.stringify(this.match_array[i].hint);
            break;
          }
        }
        if(field){
          return{
            range: new monaco.Range(1,1,line,model.getLineMaxColumn(1)),
            contents: [ {value: '**Schema check**'},{value: hint}]
          }
        }else{
          return{
            range: new monaco.Range(0,0,0,0),
            contents: []
          }
        }
      }
  },
  watch: {
    codedetail: function() {
      //每次切换后，都需要清空保存hint提示的array
      this.match_array = []
      console.log("Code editor: content change");
      this.editor.setValue(JSON.stringify(this.codedetail, null, 4));
      this.editor.trigger(this.editor.getValue(),"editor.action.formatDocument");

      //如果没有数据展示，不需要做后续的显示处理
      if(this.codedetail == null){
        return null
      }

      for (let i = 0; i < this.currentcontent.asserts.length; i++) {
        let matches = this.editor.getModel().findMatches('"' + this.currentcontent.asserts[i].field + '":',false,true,false,false);
        let match_start_linenumber = matches[0].range.startLineNumber;
        
        //如果含错误提示，才放入hint提示列表中
        if(this.currentcontent.asserts[i].flag===false){
          let match_obj = {
            fieldname:this.currentcontent.asserts[i].field,
            linenumber:match_start_linenumber,
            hint:this.currentcontent.asserts[i].hint
          }
          this.match_array.push(match_obj);
          }
        
        let fieldname = this.currentcontent.asserts[i].field;
        let fvalue = this.codedetail[fieldname];
        let fstr = JSON.stringify(fvalue, null, 4);
        //获取块大小，涂色用，根据换行符的个数
        let detail_length = fstr.split('\n').length;


        //如果断言的字段有问题，就高亮出来
        if (this.currentcontent.asserts[i].flag === false) {
          this.editor.deltaDecorations([],
            [
              {
                range: new monaco.Range(match_start_linenumber,1,match_start_linenumber+detail_length-1,1),
                options: { isWholeLine: true,className: "myContentClass"}
              }
            ]
          );
        }
        // 无断言预期，高亮展示蓝色
        else if(this.currentcontent.asserts[i].flag === 2){
          this.editor.deltaDecorations([],
            [
              {
                range: new monaco.Range(match_start_linenumber,1,match_start_linenumber+detail_length-1,1),
                options: { isWholeLine: true,className: "infoContentClass"}
              }
            ]
          );
        }
        
      }
    }
  }
}
  
  
</script>

<style>
.myContentClass {
  background: lightpink;
}
.infoContentClass {
	background: lightblue;
}
.tracking-detail {
  height: calc(100vh - 80px);
  overflow-y: auto;
}
.detail-title {
  height: 30px;
  display: flex;
  align-items: center;
}
</style>
