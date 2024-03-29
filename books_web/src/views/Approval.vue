<template>
  <div class="approval-page">
    <el-card>
      <my-bread nameOne="人员管理" nameTwo="审核人员"></my-bread>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getApprovalList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAdd"> 添加人员</el-button>
        </el-col>
      </el-row>
      <el-table :data="approvalList" border stripe>
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop="position" label="职务"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="toEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="toDetele(scope.row.id)"
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
    <!-- edit -->
    <el-dialog title="编辑订购人员信息" :visible.sync="editVisible" width="50%">
      <el-form ref="editRef" :model="editForm" label-width="100px">
        <el-form-item label="编号">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-select v-model="editForm.position" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('editRef')">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- add -->
    <el-dialog
      title="添加订购人员"
      :visible.sync="addVisible"
      width="50%"
      @before-close="reset('addRef')"
    >
      <el-form
        ref="addRef"
        :model="addForm"
        :rules="addRules"
        label-width="100px"
      >
        <el-form-item label="编号" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="职称" prop="position">
          <el-select v-model="addForm.position" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-alert
            title="默认密码为 123456"
            type="info"
            center
            :closable="false"
          >
          </el-alert>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('addRef')">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageMixin } from '@/mixin'
import { getApprovalsApi, deleteUserById, addUserApi, getUserById, editUserApi } from '@/api/user'
import { getLessonInApproval } from '@/api/lesson'
import { addRules } from '@/utils/validateRules'
export default {
  name: 'Approval',
  mixins: [pageMixin],
  data () {
    return {
      approvalList: [],
      editForm: {
        id: '',
        username: '',
        phone: '',
        position: ''
      },
      addForm: {
        username: '',
        phone: '',
        password: '123456',
        email: '',
        position: '',
        level: 3
      },
      addRules,
      options: [{
        value: '教研室主任',
        label: '教研室主任'
      },
      {
        value: '系主任',
        label: '系主任'
      },
      {
        value: '院长',
        label: '院长'
      }
      ],
      editVisible: false,
      addVisible: false
    }
  },
  methods: {
    async getApprovalList () {
      const { data } = await getApprovalsApi(this.queryInfo)
      this.approvalList = data.result
    },
    async handleExpand (row) {
      if (row.classList.length !== 0) return
      const { data } = await getLessonInApproval(row.id)
      row.classList = data.result
      console.log(row);
    },
    toAdd () {
      if (this.user.level !== 0) return this.$message.error('没有操作权限！')
      this.addVisible = true
    },
    async toDetele (id) {
      if (this.user.level !== 0) return this.$message.error('不是管理员，无法操作！')
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: approval } = await deleteUserById(id)
        if (approval.status === 200) {
          this.$message.success('删除成功!')
          this.getApprovalList()
        } else {
          this.$message.error('删除失败!')
        }
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    async toEdit (id) {
      if (this.user.level !== 0) return this.$message.error('不是管理员，无法操作！')
      const { data } = await getUserById(id)
      this.editForm = data.result
      this.editVisible = true
    },
    reset (formName) {
      this.editVisible = false
      this.addVisible = false
      this.$refs[formName].resetFields();
    },
    async confirmEdit () {
      const { data } = await editUserApi(this.editForm.id, { ...this.editForm })
      if (data.status === 200) {
        this.$message.success('修改成功!')
        this.getApprovalList()
        this.reset('editRef')
      } else {
        this.$message.error('修改失败！')
      }
    },
    confirmAdd () {
      this.$refs.addRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写完整')
        }
        const { data } = await addUserApi(this.addForm)
        if (data.status === 201) {
          this.$message.success('添加成功!')
          this.reset('addRef')
          this.getChargeList()
        } else {
          this.$message.error('添加失败!')
        }
      })
    }
  },
  watch: {
    'queryInfo.pageNum': function (val, oldVal) {
      this.getApprovalList()
    },
    'queryInfo.pageSize': function (val, oldVal) {
      this.getApprovalList()
    }
  },
  created () {
    this.getApprovalList()
  }
}
</script>

<style lang="less" scoped>
.approval-page {
  .el-alert {
    padding: 0;
  }
}
</style>