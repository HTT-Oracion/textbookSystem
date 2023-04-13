<template>
  <div class="summary-page">
    <el-card>
      <my-bread nameOne="订单管理" nameTwo="订单汇总"></my-bread>
      <el-table :data="orderList.slice((pageNum - 1) * pageSize, pageNum * pageSize)" border stripe :default-sort="{ prop: 'ISBN', order: 'descending' }" :span-method="objectSpanMethod">
        <!-- <el-table-column prop="id" label="订单编号"></el-table-column> -->
        <el-table-column prop="ISBN" label="ISBN"></el-table-column>
        <el-table-column prop="book_name" label="教材名称"></el-table-column>
        <el-table-column prop="dep_name" label="院系名称"></el-table-column>
        <el-table-column prop="major_name" label="专业名称"></el-table-column>
        <el-table-column prop="cls_name" label="班级名称"></el-table-column>
        <el-table-column prop="teacher_num" label="教师教材数量"></el-table-column>
        <el-table-column prop="total" label="学生教材数量"></el-table-column>
        <el-table-column prop="charge" label="订购人姓名">
          <template #default="scope">
            <el-tag type="success">{{ scope.row.charge }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approval" label="审批人姓名">
          <template #default="scope">
            <el-tag type="danger">{{ scope.row.approval }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订购时间">
          <template #default="scope">{{ scope.row.charge_date | format }}</template>
        </el-table-column>
        <el-table-column label="审批时间">
          <template #default="scope">{{ scope.row.approval_date | format }}</template>
        </el-table-column>
        <el-table-column prop="price" label="花费（元）"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 15, 20, 25]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="orderList.length"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { pageMixin } from '@/mixin'
import { getOrdersApi } from '@/api/order'
export default {
  name: 'Summary',
  mixins: [pageMixin],
  data () {
    return {
      orderList: [],
      arr: [],
      pageSize: 5,
      pageNum: 1
    }
  },
  methods: {
    async getOrderList () {
      const { data } = await getOrdersApi()
      this.orderList = this.setTableData(data.result)
      this.total = data.result.length
      this.setTable(this.orderList, 'ISBN')
    },
    // 处理得到需要的table数据表
    setTableData (data) {
      const newArr = data.map((item, index) => {
        if (item.approval === null) {
          item.approval = {}
        }
        return {
          ISBN: item.book.ISBN,
          book_name: item.book.book_name,
          dep_name: item.department.dep_name,
          major_name: item.major.major_name,
          cls_name: item.class.cls_name,
          teacher_num: item.lesson.teacher_num,
          total: item.class.total,
          charge: item.charge.username,
          approval: item.approval.username,
          charge_date: item.charge_date,
          approval_date: item.approval_date,
          price: item.book.price * (item.class.total + item.lesson.teacher_num)
        }
      })
      return newArr
    },
    setTable (data, title) {
      let spanOneArr = []
      let concatOne = 0
      data.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1)
        } else {
          if (item[title] && item[title] === data[index - 1][title]) {
            spanOneArr[concatOne] += 1
            spanOneArr.push(0)
          } else {
            spanOneArr.push(1)
            concatOne = index
          }
        }
      })
      var obj = {}
      obj[title] = spanOneArr
      this.arr.push(obj)
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.arr[0].ISBN[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style>
</style>