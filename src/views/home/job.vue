<style scoped>
    .job-list {
        display: flex;
    }

    .job-item {
        margin: 0 10px 10px 0;
        width: 200px;
    }

    .new-task-list {
        padding: 10px;
    }

    .task-list-content {
        padding: 10px;
    }

    .task-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding-bottom: 20px;
    }

    .task-list button {
        margin: 5px 0;
    }

    .task-button {
        white-space: inherit;
        line-height: 18px;
        text-align: left;
    }

    .task-button p {
        margin: 0;
    }

    .task-button .task-end {
        font-size: 12px;
        color: gray;
    }

    h6 {
        margin: 0 0 10px 0;
    }
</style>
<template>
    <div>
        <div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>任务池</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="taskAddDialogShow">新建 +
                    </el-button>
                </div>
                <div class="text item">
                    <draggable :options="{group:'job'}" class="new-task-list" @add="dragAdd($event,0,0)">
                        <el-button plain class="task-button" @click="taskUpdateShow(task)"
                                   v-for="task in taskList['list1']" :value="task.id" :key="task.id">
                            <p>{{task.title}}</p>
                            <p class="task-end">{{task.end_time}}</p>
                        </el-button>
                    </draggable>
                </div>
            </el-card>
        </div>
        <br/>
        <div class="job-list">

            <el-card class="box-card job-item" v-for="group in taskList['list2']">
                <div slot="header" class="clearfix">
                    <span @click="groupUpdateShow(group)">{{group.name}}</span>
                </div>
                <div class="text item task-list-content">
                    <h6>未开始</h6>
                    <draggable :options="{group:'job'}" class="task-list" @add="dragAdd($event,group.id,0)">
                        <el-button plain class="task-button" v-for="task in group.taskList[0]"
                                   @click="taskUpdateShow(task)" :value="task.id" :key="task.id">
                            <p>{{task.title}}</p>
                            <p class="task-end">{{task.end_time}} 结束</p>
                        </el-button>
                    </draggable>
                    <h6>进行中</h6>
                    <draggable :options="{group:'job'}" class="task-list" @add="dragAdd($event,group.id,1)">
                        <el-button plain class="task-button" v-for="task in group.taskList[1]"
                                   @click="taskUpdateShow(task)" :value="task.id" :key="task.id">
                            <p>{{task.title}}</p>
                            <p class="task-end">{{task.end_time}} 结束</p>
                        </el-button>
                    </draggable>
                    <h6>已完成</h6>
                    <draggable :options="{group:'job'}" class="task-list" @add="dragAdd($event,group.id,2)">
                        <el-button plain class="task-button" v-for="task in group.taskList[2]"
                                   @click="taskUpdateShow(task)" :value="task.id" :key="task.id">
                            <p>{{task.title}}</p>
                            <p class="task-end">{{task.end_time}} 结束</p>
                        </el-button>
                    </draggable>
                </div>
            </el-card>

            <el-button round style="align-self: flex-start;" @click="groupAddDialogShow"> + </el-button>

        </div>

        <el-dialog
                :title="taskDialogTitle"
                :visible.sync="taskDialogVisible"
                size="large"
                :before-close="taskDialogClose">
            <span>
                <el-row>
                  <el-col :span="12">
                      <el-input v-model="taskForm.title" placeholder="标题"></el-input>
                  </el-col>
                  <el-col :span="12">
                      <el-date-picker
                              v-model="taskForm.start_time"
                              type="date"
                              placeholder="开始日期">
                      </el-date-picker>
                      <el-date-picker
                              v-model="taskForm.end_time"
                              type="date"
                              placeholder="结束日期">
                      </el-date-picker>
                  </el-col>
                </el-row>
                 <mavon-editor style="height: 100%;" v-model="taskForm.content"
                               :toolbarsFlag="editorOption.toolbarsFlag" :subfield="editorOption.subfield"
                               :defaultOpen="editorOption.defaultOpen"></mavon-editor>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="taskDelete(taskForm.id)" type="danger" style="margin-right: 50px;"
                           v-show="taskDeleteVisible">删 除</el-button>
                 <el-button type="primary" @click="edit=true" v-show="!edit">编 辑</el-button>

                <el-button @click="taskDialogClose" v-show="edit">取 消</el-button>
                <el-button type="primary" @click="taskAdd" v-show="edit">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                :title="groupDialogTitle"
                :visible.sync="groupDialogVisible"
                size="mini"
                :before-close="groupDialogClose">
            <span>
               <el-select v-model="groupForm.uid" placeholder="请选择">
                  <el-option
                          v-for="user in users"
                          :label="user.user_name"
                          :value="user.user_id">
                  </el-option>
                </el-select>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="groupDelete(groupForm.id)" type="danger" style="margin-right: 50px;"
                           v-show="groupDeleteVisible">删 除</el-button>
                <el-button @click="groupDialogClose">取 消</el-button>
                <el-button type="primary" @click="groupAdd">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
  import Api from '../../common/api'
  import Date from '../../common/date'
  import draggable from 'vuedraggable'
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'

  export default {
    data () {
      return {
        taskDialogTitle: '新建任务',
        taskDialogVisible: false,
        taskDeleteVisible: false,
        groupDialogVisible: false,
        groupDialogTitle: '新建分组',
        groupDeleteVisible: false,
        taskForm: {
          id: '',
          title: '',
          start_time: '',
          end_time: '',
          content: ''
        },
        taskList: [],
        users: [],
        groupForm: {
          id: '',
          uid: ''
        },
        edit: true
      }
    },
    created () {
      this.selectUser()
      this.taskSelect()
    },
    computed: {
      jobUpdate () {
        return this.$store.state.job.jobUpdate
      },
      editorOption () {
        if (this.edit) {
          return {
            toolbarsFlag: true,
            subfield: true,
            defaultOpen: 'preview'
          }
        } else {
          return {
            toolbarsFlag: false,
            subfield: false,
            defaultOpen: 'preview'
          }
        }
      }
    },
    watch: {
      jobUpdate: function () {
        this.taskSelect()
      }
    },
    methods: {
      taskAddDialogShow: function () {
        this.taskDialogTitle = '新建任务'
        this.taskDialogVisible = true
        this.taskDeleteVisible = false
        this.edit = true
      },
      taskDialogClose: function () {
        this.taskDialogVisible = false
        this.taskForm = {
          id: '',
          title: '',
          start_time: '',
          end_time: '',
          content: ''
        }
      },
      taskAddCheck: function () {
        if (this.taskForm.title == '') {
          this.$message({
            type: 'error',
            message: '标题必须！'
          })
          return false
        }
        if (this.taskForm.content == '') {
          this.$message({
            type: 'error',
            message: '内容必须！'
          })
          return false
        }
        if (this.taskForm.start_time == '') {
          this.$message({
            type: 'error',
            message: '开始时间必须！'
          })
          return false
        }
        if (this.taskForm.end_time == '') {
          this.$message({
            type: 'error',
            message: '结束时间必须！'
          })
          return false
        }
        return true
      },
      taskAdd: function () {
        if (this.taskAddCheck()) {
          var _this = this
          var data = {
            id: this.taskForm.id,
            title: this.taskForm.title,
            content: this.taskForm.content,
            start_time: Date.dateToStr(this.taskForm.start_time, 'yyyy-MM-dd'),
            end_time: Date.dateToStr(this.taskForm.end_time, 'yyyy-MM-dd')
          }
          Api.post('/Job/add', data, function (res) {
            _this.$message({
              type: 'success',
              message: res.info
            })
            _this.taskDialogClose()
            _this.taskSelect()
          })
        }
      },
      taskSelect: function () {
        var _this = this
        Api.get('/Job/select', function (res) {
          _this.taskList = res.info
        })
      },
      taskUpdateShow: function (task) {
        this.taskDialogTitle = '编辑任务'
        this.taskDialogVisible = true
        this.taskDeleteVisible = true
        this.taskForm = {
          id: task.id,
          title: task.title,
          content: task.content,
          start_time: Date.strToDate(task.start_time),
          end_time: Date.strToDate(task.end_time)
        }
        this.edit = false
      },
      taskDelete: function (id) {
        var _this = this
        Api.post('/Job/delete', {id: id}, function (res) {
          _this.$message({
            type: 'success',
            message: res.info
          })
          _this.taskDialogClose()
          _this.taskSelect()
        })
      },
      groupAddDialogShow: function () {
        this.groupDialogVisible = true
      },
      groupDialogClose: function () {
        this.groupDialogVisible = false
      },
      groupAdd: function () {
        if (this.groupForm.uid == '') {
          return
        }
        var _this = this
        var data = {
          id: this.groupForm.id,
          uid: this.groupForm.uid
        }
        Api.post('/Job/groupAdd', data, function (res) {
          _this.$message({
            type: 'success',
            message: res.info
          })
          _this.groupDialogClose()
          _this.taskSelect()
        })
      },
      groupUpdateShow: function (group) {
        this.groupDialogTitle = '编辑分组'
        this.groupDialogVisible = true
        this.groupDeleteVisible = true
        this.groupForm = {
          id: group.id,
          uid: group.uid
        }
      },
      groupDelete: function (id) {
        var _this = this
        Api.post('/Job/groupDelete', {id: id}, function (res) {
          _this.$message({
            type: 'success',
            message: res.info
          })
          _this.groupDialogClose()
          _this.taskSelect()
        })
      },
      selectUser () {
        var _this = this
        Api.get('/User/select', function (res) {
          _this.users = res
        })
      },
      dragAdd (evt, groupId, status) {
        var taskId = evt.item.value
        var _this = this
        Api.post('/Job/move', {id: taskId, group_id: groupId, status: status}, function (res) {
          _this.$message({
            type: 'success',
            message: res.info
          })
        })
      }
    },
    components: {
      draggable,
      mavonEditor
    }
  }
</script>