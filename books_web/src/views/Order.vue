<template>
  <div class="order-page">
    <el-card>
      <my-bread nameOne="订单管理" nameTwo="订单列表"></my-bread>
      <!-- <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getOrderList" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>-->
      <el-table :data="orderList.slice((pageNum - 1) * pageSize, pageNum * pageSize)" border stripe v-loading="loading">
        <el-table-column label="订单编号">
          <template #default="scope">
            <span class="order-id" :class="scope.row.charge_status < 2 ? 'red': ''">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="book.ISBN" label="ISBN"></el-table-column>
        <el-table-column prop="book.book_name" label="教材名称"></el-table-column>
        <el-table-column label="订购数量">
          <template #default="scope">
            <span>{{ totalNum(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总价(元)">
          <template #default="scope">
            <span>{{ totalPrice(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="charge.username" label="订购人姓名"></el-table-column>
        <el-table-column prop="approval.username" label="审批人姓名">
          <template #default="scope">
            <span v-if="scope.row.approval && scope.row.approval.username">{{scope.row.approval.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订购时间" width="100">
          <template #default="scope">
            <span>{{ scope.row.charge_date | format }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审批时间" width="100">
          <template #default="scope">
            <span>{{ scope.row.approval_date | format }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订购状态">
          <template #default="scope">
            <el-tag v-if="scope.row.charge_status === 0" type="danger">未订购</el-tag>
            <el-tag v-else type="success">已订购</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template #default="scope">
            <el-tag v-if="scope.row.approval_status === 1" type="primary">已审批</el-tag>
            <el-tag v-else type="warning">未审批</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否入库">
          <template #default="scope">
            <el-tag v-if="scope.row.charge_status === 2" type="primary">已入库</el-tag>
            <el-tag v-else type="warning">未入库</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="相关操作" width="250">
          <template #default="scope">
            <el-button type="success" size="mini" :disabled="scope.row.approval_status === 1" @click="approval(user.id, scope.row)">审批</el-button>
            <el-button type="warning" size="mini" :disabled="
                scope.row.charge_status === 2 || scope.row.approval_status === 0
              " @click="warehouse(scope.row)">入库</el-button>

            <el-button type="danger" size="mini" @click="reject(scope.row)" :disabled="
                scope.row.charge_status === 2 || scope.row.approval_status === 1
              ">撤销</el-button>
          </template>
        </el-table-column>
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
    <!-- detail -->
    <el-dialog title="订单详情" :visible.sync="orderVisible" width="50%">
      <el-form :model="orderDetail" ref="orderRef" label-width="100px">
        <el-form-item label="订单编号">
          <el-input v-model="orderDetail.id"></el-input>
        </el-form-item>
        <el-form-item label="教材ISBN">
          <el-input v-model="orderDetail.book.ISBN"></el-input>
        </el-form-item>
        <el-form-item label="教材名称">
          <el-input v-model="orderDetail.book.book_name"></el-input>
        </el-form-item>
        <el-form-item label="订购数量">
          <el-input v-model="orderDetail.book.ISBN"></el-input>
        </el-form-item>
        <el-form-item label="订购者姓名">
          <el-input v-model="orderDetail.charge.username"></el-input>
        </el-form-item>
        <el-form-item label="审批人姓名">
          <el-input v-model="orderDetail.approval.username"></el-input>
        </el-form-item>
        <el-form-item label="订购时间">
          <el-input :value="orderDetail.charge_date | format"></el-input>
        </el-form-item>
        <el-form-item label="审批时间">
          <el-input :value="orderDetail.approval_date | format"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetOrderRef('orderRef')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { editLessonApi } from '@/api/lesson'
import { editBookNumApi } from '@/api/book'
import { getOrdersApi, approvalOrderApi, deleteOrderApi, warehouseOrderApi, getOrderById } from '@/api/order'
export default {
  name: 'Order',
  data () {
    return {
      orderList: [],
      arr: [],
      loading: false,
      orderVisible: false,
      orderDetail: {
        book: {
          ISBN: ''
        },
        class: {},
        major: {},
        department: {},
        charge: {},
        approval: {},
        charge_date: '',
        approval_date: ''
      },
      pageSize: 5,
      pageNum: 1
    }
  },
  methods: {
    resetOrderRef (ref) {
      this.orderVisible = false
      this.$refs[ref].resetFields()
    },
    async getOrderList () {
      const { data } = await getOrdersApi()
      this.orderList = data.result
    },
    totalNum (row) {
      return parseInt(row.lesson.teacher_num) + parseInt(row.class.total)
    },
    totalPrice (row) {
      const num = this.totalNum(row)
      return num * parseInt(row.book.price)
    },
    // 订单详情
    // async showOrder (row) {
    //   console.log(row);
    //   if (!this.approval || this.approval.username) {
    //     return
    //   }
    //   this.orderDetail = {}
    //   const { data } = await getOrderById(row.id)
    //   this.orderDetail = data.result
    //   this.orderVisible = true
    //   console.log(data.result);
    // },
    // 审批
    approval (approvalId, postForm) {
      if (this.user.level !== 0 && this.user.level !== 3) return this.$message.error('没有操作权限！')
      // console.log(approvalId, postForm);
      this.$confirm('进行审批, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        const { data: res } = await editLessonApi(postForm.lessonId, { approvalId })
        if (res.status === 200) {
          this.$message.success('审批成功!')
          this.loading = true
          const { data: lesson } = await approvalOrderApi(postForm.lessonId, { ...postForm, approvalId })
          if (lesson.status === 201) {
            this.$notify.success({
              title: '结果信息',
              message: '订单信息已修改！',
              showClose: false
            });
            this.loading = false
            this.getOrderList()
          }
        } else {
          this.$message.error('审批失败!')
        }
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    // 入库
    warehouse (postForm) {
      if (this.user.level !== 0 && this.user.level !== 3) return this.$message.error('没有操作权限！')
      // console.log(postForm.bookId, { ...postForm });
      if (postForm.chargeId !== this.user.id) return this.$message.warning('需要同一订购者才能执行此操作!')
      const times = postForm.book.times + 1
      const total_books = postForm.book.nums + postForm.class.total + postForm.lesson.teacher_num
      this.$confirm('进行入库操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        const { data: Order } = await warehouseOrderApi(postForm.id)
        const { data: book } = await editBookNumApi(postForm.bookId, { times, nums: total_books })
        try {
          if (Order.status === 201) {
            if (book.status === 201) {
              this.$message.success('入库成功！')
              this.$nextTick(() => {
                this.getOrderList()
              })
            } else {
              this.$message.error('入库失败!')
            }
          }
        } catch (error) {
          this.$message.error(error)
        }
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    // 撤销
    reject (row) {
      if (this.user.level !== 0 && this.user.level !== 3) return this.$message.error('没有操作权限！')
      this.$confirm('进行驳回操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: order } = await deleteOrderApi(row.id)
        if (order.status === 200) {
          const { data: lesson } = await editLessonApi(row.lessonId, { chargeId: null, approvalId: null })
          if (lesson.status === 200) {
            this.$notify({
              title: '操作成功',
              message: '订单信息已修改！',
              type: 'success',
              duration: 1000,
              showClose: false
            })
            this.getOrderList()
          }
        }
      }).catch(() => {
        this.$message.info('取消操作')
      })
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

<style lang="less" scoped>
.order-page {
  .order-id {
    cursor: pointer;
    // &:hover {
    //   text-decoration: underline;
    //   color: skyblue;
    // }
  }
  .red {
    color: red;
  }
}
</style>