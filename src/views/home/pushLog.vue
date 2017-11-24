<template>
  <div>
    <br/>
    <el-row>
      <el-col :span="2">&nbsp;</el-col>
      <el-col :span="20">

        <div class="ui feed" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
            <el-table
                    :data="logs"
                    style="width: 100%">
                <el-table-column
                        prop="id"
                        label="ID"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="push_address"
                        label="发布环境"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="branch_name"
                        label="分支名">
                </el-table-column>
                <el-table-column
                        label="发布结果">
                    <template scope="scope">
                        <el-popover
                                ref="popover1"
                                placement="top-start"
                                title="发布结果">
                            <div v-html="scope.row.result"></div>
                        </el-popover>
                        <el-button v-popover:popover1 type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="create_user"
                        label="发布人">
                </el-table-column>
                <el-table-column
                        prop="create_time"
                        label="日期"
                        width="180">
                </el-table-column>
            </el-table>
        </div>

      </el-col>
      <el-col :span="2">&nbsp;</el-col>
    </el-row>

  </div>
</template>

<script>
  import Vue from 'vue'
  import Api from '../../common/api'
  import infiniteScroll from 'vue-infinite-scroll'
  Vue.use(infiniteScroll)

  export default {
    data() {
      return {
        logs: [],
        busy: false,
        page: 1
      }
    },
    methods: {
      loadMore: function () {
        this.busy = true
        var _this = this
        Api.get('/Log/pushSelect/page/' + this.page, function (res) {
          console.log(_this.page)
          if (res.length > 0) {
            res.forEach(function (data) {
              _this.logs.push(data);
            })
            _this.page++
            _this.busy = false
          }
        });

      }
    }
  }
</script>