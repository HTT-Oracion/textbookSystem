<template>
  <div class="department-page">
    <el-card>
      <my-bread nameOne="院系管理" nameTwo="院系列表"></my-bread>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getDepList" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getDepList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAdd"> 添加院系</el-button>
        </el-col>
      </el-row>
      <el-table :data="depList" border stripe>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="dep_name" label="院系名称"></el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="primary" @click="toEdit(scoped.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="deleteDep(scoped.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[2, 5, 7, 10]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- add -->
    <el-dialog
      title="添加院系"
      :visible.sync="addDepVisible"
      width="50%"
      @before-close="handleClose"
    >
      <el-form ref="addDepRef" :model="postForm" label-width="100px">
        <el-form-item prop="id" label="院系编号">
          <el-input v-model="postForm.id"></el-input>
        </el-form-item>
        <el-form-item prop="dep_name" label="院系名称">
          <el-input v-model="postForm.dep_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('addDepRef')">取 消</el-button>
        <el-button type="primary" @click="confirmAddDep">确 定</el-button>
      </span>
    </el-dialog>
    <!-- edit -->
    <el-dialog title="编辑院系" :visible.sync="editDepVisible" width="50%">
      <el-form ref="editDepRef" :model="postForm" label-width="100px">
        <el-form-item prop="id" label="院系编号">
          <el-input v-model="postForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item prop="dep_name" label="院系名称">
          <el-input v-model="postForm.dep_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('editDepRef')">取 消</el-button>
        <el-button type="primary" @click="confirmEditDep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDepsApi, deleteDepApi, addDepApi, getDepById, editDepApi } from '@/api/information'
import { pageMixin } from '@/mixin'
export default {
  name: 'Department',
  mixins: [pageMixin],
  data () {
    return {
      // 院系列表
      depList: [],
      postForm: {
        id: '',
        dep_name: ''
      },
      addDepVisible: false,
      editDepVisible: false
    }
  },
  watch: {
    'queryInfo.pageNum': function (val, oldVal) {
      this.getDepList()
    },
    'queryInfo.pageSize': function (val, oldVal) {
      this.getDepList()
    }
  },
  created () {
    this.getDepList()
  },
  methods: {
    async getDepList () {
      const { data } = await getDepsApi(this.queryInfo)
      this.depList = data.result
      this.total = data.result.length
    },
    reset (ref) {
      this.addDepVisible = false
      this.editDepVisible = false
      this.$refs[ref].resetFields()
    },
    toAdd () {
      if (this.user.level !== 0 && this.user.level !== 1) return this.$message.error('没有操作权限！')
      this.addDepVisible = true
    },
    async toEdit (id) {
      if (this.user.level !== 0 && this.user.level !== 1) return this.$message.error('没有操作权限！')
      this.editDepVisible = true
      const { data } = await getDepById(id)
      this.postForm = data.result
    },
    async deleteDep (id) {
      if (this.user.level !== 0 && this.user.level !== 1) return this.$message.error('没有操作权限！')
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteDepApi(id)
        if (data.status === 200) {
          this.$message.success('删除成功!')
          this.getDepList()
        } else {
          this.$message.error('删除失败!')
        }
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    async confirmAddDep () {
      if (this.postForm.id === '' || this.postForm.dep_name === '') return this.$message.error('请填写完整!')
      const { data } = await addDepApi(this.postForm)
      if (data.status === 200) {
        this.$message.success('添加成功!')
        this.getDepList()
        this.reset('addDepRef')
      } else {
        this.$message.error('添加失败!')
        this.reset('addDepRef')
      }
    },
    async confirmEditDep () {
      const { data } = await editDepApi(this.postForm.id, this.postForm)
      if (data.status === 200) {
        this.$message.success('修改成功!')
        this.reset('editDepRef')
        this.getDepList()
      } else {
        this.$message.error('修改失败!')
        this.reset('editDepRef')
      }
    },
    handleClose () {
      this.reset('editDepRef')
    }
  }
}
</script>

<style>
</style>