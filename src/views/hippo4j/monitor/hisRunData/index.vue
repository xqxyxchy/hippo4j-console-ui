<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.tenantId"
        clearable
        placeholder="租户ID"
        style="width:220px"
        class="filter-item"
        @change="tenantSelectList()"
      >
        <el-option
          v-for="item in tenantOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.itemId"
        clearable
        placeholder="项目ID"
        style="width:220px"
        class="filter-item"
        @change="itemSelectList()"
      >
        <el-option
          v-for="item in itemOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <el-input 
        style="width:220px"
        clearable
        class="filter-item" 
        v-model="listQuery.tpId" 
        placeholder="请输入内容" 
      />
      <el-date-picker
        v-model="listQuery.datetime"
        clearable
        class="filter-item" 
        type="datetimerange"
        value-format="timestamp"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="fetchData"
      >
        搜索
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" >
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column label="时刻" align="center" :width="rowWidth">
        <template slot-scope="scope">{{ scope.row.timestamp|parseTime() }}</template>
      </el-table-column>
      <el-table-column label="租户ID" align="center">
        <template slot-scope="scope">{{ scope.row.tenantId }}</template>
      </el-table-column>
      <el-table-column label="项目ID" align="center" :width="rowWidth">
        <template slot-scope="scope">{{ scope.row.itemId }}</template>
      </el-table-column>
      <el-table-column label="线程池ID" align="center" :width="rowWidth">
        <template slot-scope="scope">{{ scope.row.tpId }}</template>
      </el-table-column>
      <!-- <el-table-column label="实例ID" align="center" :width="rowWidth">
        <template slot-scope="scope">{{ scope.row.instanceId }}</template>
      </el-table-column> -->
      <el-table-column label="当前负载" align="center">
        <template slot-scope="scope">{{ scope.row.currentLoad }}%</template>
      </el-table-column>
      <el-table-column label="峰值负载" align="center">
        <template slot-scope="scope">{{ scope.row.peakLoad }}%</template>
      </el-table-column>
      <el-table-column label="线程数量" align="center">
        <template slot-scope="scope">{{ scope.row.poolSize }}</template>
      </el-table-column>
      <el-table-column label="活跃数量" align="center" >
        <template slot-scope="scope">{{ scope.row.activeSize }}</template>
      </el-table-column>
      <el-table-column label="队列容量" align="center">
        <template slot-scope="scope">{{ scope.row.queueCapacity }}</template>
      </el-table-column>
      <el-table-column label="队列元素" align="center">
        <template slot-scope="scope">{{ scope.row.queueSize }}</template>
      </el-table-column>
      <el-table-column label="队列余量" align="center" >
        <template slot-scope="scope">{{ scope.row.queueRemainingCapacity }}</template>
      </el-table-column>
      <el-table-column label="完成次数" align="center" >
        <template slot-scope="scope">{{ scope.row.completedTaskCount }}</template>
      </el-table-column>
      <el-table-column label="拒绝次数" align="center">
        <template slot-scope="scope">{{ scope.row.rejectCount }}</template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />

  </div>
</template>

<script>
  import * as itemApi from '@/api/hippo4j-item'
  import * as tenantApi from '@/api/hippo4j-tenant'
  import * as threadPoolApi from '@/api/hippo4j-threadPool'
  import * as monitorApi from '@/api/hippo4j-monitor'
  import waves from '@/directive/waves'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'JobProject',
    components: { Pagination },
    directives: { waves },
    filters: {
    },
    data() {
      return {
        rowWidth: '200',
        isRejectShow: false, // 是否显示spi拒绝策略
        list: null,
        listLoading: true,
        total: 0,
        listQuery: {
          current: 1,
          size: 10,
          tpId: 'web-pool',
          itemId: '',
          datetime: null
        },
        isEditDisabled: false,
        tenantOptions: [],
        threadPoolOptions: [],
        itemOptions: [],
        itemTempOptions: [],
        size: 500,
        temp: {
          id: undefined,
          tenantId: '',
          itemId: ''
        },
        visible: true
      }
    },
    created() {
      this.fetchData()
      // 初始化租户、项目
      this.initSelect()
    },
    mounted() {
      this.isEditDisabled = this.$cookie.get('userName') !== 'admin'
    },
    methods: {
      fetchData() {
        this.listLoading = true
        monitorApi.monitorList(this.listQuery).then(response => {
          const { records } = response
          const { total } = response
          this.total = total
          this.list = records
          this.listLoading = false
        })
      },
      changeAlarm(row) {
        threadPoolApi.alarmEnable(row).then(() => {
          this.fetchData()
          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
        })
      },
      initSelect() {
        tenantApi.list({ size: this.size }).then(response => {
          const { records } = response
          for (let i = 0; i < records.length; i++) {
            this.tenantOptions.push({
              key: records[i].tenantId,
              display_name: records[i].tenantId + ' ' + records[i].tenantName
            })
          }
        })
      },

      tenantSelectList() {
        this.listQuery.itemId = null

        this.temp.itemId = null

        this.itemOptions = []
        this.itemTempOptions = []
        this.threadPoolOptions = []
        const tenantId = { tenantId: this.listQuery.tenantId, size: this.size }
        itemApi.list(tenantId).then(response => {
          const { records } = response
          for (let i = 0; i < records.length; i++) {
            this.itemOptions.push({
              key: records[i].itemId,
              display_name: records[i].itemId + ' ' + records[i].itemName
            })
          }
        })
      },


      itemSelectList() {

        this.threadPoolOptions = []
        const itemId = { itemId: this.listQuery.itemId, size: this.size }
        threadPoolApi.list(itemId).then(response => {
          const { records } = response
          for (let i = 0; i < records.length; i++) {
            this.threadPoolOptions.push({
              key: records[i].tpId,
              display_name: records[i].tpId
            })
          }
        })
      },

    }
  }
</script>
