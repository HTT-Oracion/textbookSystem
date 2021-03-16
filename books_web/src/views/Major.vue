<template>
  <div class="major-page">
    <el-card>
      <my-bread nameOne="院系管理" nameTwo="专业列表"></my-bread>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getMajorList">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getMajorList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addMajorVisible = true">
            添加专业</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="MajorList" border stripe>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="major_name" label="专业名称"></el-table-column>
        <el-table-column
          prop="department.dep_name"
          label="院系名称"
        ></el-table-column>
        <el-table-column
          prop="department.id"
          label="院系编号"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="primary" @click="toEdit(scoped.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="deleteMajor(scoped.row.id)"
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
      title="添加专业"
      :visible.sync="addMajorVisible"
      width="50%"
      @before-close="handleClose"
    >
      <el-form ref="addMajorRef" :model="postForm" label-width="100px">
        <el-form-item prop="id" label="专业编号：">
          <el-input v-model="postForm.id"></el-input>
        </el-form-item>
        <el-form-item prop="major_name" label="专业名称：">
          <el-input v-model="postForm.major_name"></el-input>
        </el-form-item>
        <el-form-item prop="departmentId" label="专业名称">
          <el-select v-model="postForm.departmentId" placeholder="请选择">
            <el-option
              v-for="(item, index) in depList"
              :key="index"
              :label="item.dep_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('addMajorRef')">取 消</el-button>
        <el-button type="primary" @click="confirmAddMajor">确 定</el-button>
      </span>
    </el-dialog>
    <!-- edit -->
    <el-dialog title="编辑专业" :visible.sync="editMajorVisible" width="50%">
      <el-form ref="editDepRef" :model="postForm" label-width="100px">
        <el-form-item prop="id" label="专业编号">
          <el-input v-model="postForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item prop="major_name" label="专业名称">
          <el-input v-model="postForm.major_name"></el-input>
        </el-form-item>
        <el-form-item prop="departmentId" label="院系">
          <!-- <el-select v-model="postForm.departmentId" placeholder="请选择" diasbled>
            <el-option
              v-for="(item, index) in depList"
              :key="index"
              :label="item.dep_name"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
          <el-input v-model="postForm.departmentId" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('editDepRef')">取 消</el-button>
        <el-button type="primary" @click="confirmEditMajor">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMajorsApi,
  getMajorById,
  getDepsApi,
  addMajorApi,
  editMajorApi,
  deleteMajorApi
} from '@/api/information'
import { pageMixin } from '@/mixin'
export default {
  name: 'Major',
  mixins: [pageMixin],
  data () {
    return {
      MajorList: [],
      depList: [],
      postForm: {
        id: '',
        major_name: '',
        departmentId: ''
      },
      addMajorVisible: false,
      editMajorVisible: false,
    }
  },
  watch: {
    'queryInfo.pageNum': function (val, oldVal) {
      this.getMajorList()
    },
    'queryInfo.pageSize': function (val, oldVal) {
      this.getMajorList()
    }
  },
  created () {
    this.getMajorList()
    this.getDepList()
  },
  methods: {
    reset (ref) {
      this.addMajorVisible = false
      this.editMajorVisible = false
      this.$refs[ref].resetFields()
    },
    async getDepList () {
      const { data } = await getDepsApi()
      this.depList = data.result
    },
    async getMajorList () {
      const { data } = await getMajorsApi(this.queryInfo)
      this.MajorList = data.result
      console.log(this.MajorList);
    },
    async toEdit (id) {
      this.editMajorVisible = true
      const { data } = await getMajorById(id)
      this.postForm = data.result
    },
    deleteMajor (id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteMajorApi(id)
        if (data.status === 200) {
          this.$message.success('删除成功!')
          this.getMajorList()
        } else {
          this.$message.error('删除失败!')
        }
      })
    },
    async confirmAddMajor () {
      if (this.postForm.id === '' || this.postForm.major_name === '') return this.$message.error('请填写完整!')
      const { data } = await addMajorApi(this.postForm)
      if (data.status === 200) {
        this.$message.success('添加成功!')
        this.getMajorList()
        this.reset('addMajorRef')
      } else {
        this.$message.error('添加失败!')
        this.reset('addMajorRef')
      }
    },
    async confirmEditMajor () {
      const { data } = await editMajorApi(this.postForm.id, this.postForm)
      if (data.status === 200) {
        this.$message.success('修改成功!')
        this.reset('editMajorRef')
        this.getMajorList()
      } else {
        this.$message.error('修改失败!')
        this.reset('editMajorRef')
      }
    },
    handleClose () {
      this.reset('editMajorRef')
    }
  }
}
</script>

<style>
</style>