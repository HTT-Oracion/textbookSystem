<template>
  <div class="cate-gory">
    <el-card>
      <my-bread nameOne="教材管理" nameTwo="教材类别"></my-bread>
      <el-row>
        <el-col :span="8">
          <el-input v-model="query" @clear="getCategories" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getCategories"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAdd"> 添加类别</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="categories.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
        border
        stripe
      >
        <el-table-column prop="id" label="编号"></el-table-column>
        <el-table-column prop="cat_name" label="类别名称"></el-table-column>
        <el-table-column label="操作">
          <template #default="scoped">
            <el-button type="primary" @click="toEdit(scoped.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" @click="deleteCate(scoped.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 15, 25, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="categories.length"
      >
      </el-pagination>
    </el-card>
    <!-- 添加 -->
    <el-dialog
      title="添加类别"
      :visible.sync="addCateVisible"
      width="50%"
      v-if="addCateVisible"
    >
      <el-form ref="addCateRef" :model="addCateForm" label-width="100px">
        <el-form-item prop="id" label="教材类别：">
          <el-input v-model="addCateForm.id"></el-input>
        </el-form-item>
        <el-form-item prop="cat_name" label="类别名称：">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog
      title="编辑类别"
      :visible.sync="editCateVisible"
      width="50%"
      v-if="editCateVisible"
    >
      <el-form ref="editCateRef" :model="editCateForm" label-width="100px">
        <el-form-item prop="id" label="编号">
          <el-input v-model="editCateForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item prop="cat_name" label="类别名称">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="editCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCatesApi, getCateById, editCateApi, deleteCateApi, addCateApi } from '@/api/book'
export default {
  name: 'Category',
  data () {
    return {
      categories: [],
      editCateForm: {
        id: '',
        cat_name: ''
      },
      addCateForm: {
        id: '',
        cat_name: ''
      },
      query: '',
      pageNum: 1,
      pageSize: 5,
      editCateVisible: false,
      addCateVisible: false
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    async getCategories () {
      const { data } = await getCatesApi({ query: this.query })
      this.categories = data.result
    },
    toEdit (id) {
      if (this.user.level !== 0 && this.user.level !== 1) return this.$message.error('没有操作权限！')
      this.editCateVisible = true
      this.getCurrentCate(id)
    },
    toAdd () {
      if (this.user.level !== 0 && this.user.level !== 1) return this.$message.error('没有操作权限！')
      this.addCateVisible = true
    },
    async getCurrentCate (id) {
      const { data } = await getCateById(id)
      this.editCateForm = data.result
    },
    async confirmEditCate () {
      const { data } = await editCateApi(this.editCateForm.id, this.editCateForm)
      if (data.status === 200) {
        this.$message.success('修改成功!')
      } else {
        this.$message.error('修改失败!')
      }
      this.$refs.editCateRef.resetFields()
      this.getCategories()
      this.editCateVisible = false
    },
    async confirmAddCate () {
      if (this.addCateForm === {}) {
        this.addCateVisible = false
        return this.$message.error('请填写信息')
      }
      const { data } = await addCateApi(this.addCateForm)
      if (data.status === 200) {
        this.$message.success('添加成功！')
        this.getCategories()
      } else {
        this.$message.error('添加失败！')
      }
      this.$refs.addCateRef.resetFields()
      this.addCateVisible = false
    },
    deleteCate (id) {
      if (this.user.level !== 0 && this.user.level !== 1) return this.$message.error('没有操作权限！')
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await deleteCateApi(id)
        if (data.status === 200) {
          this.$message.success('删除成功!')
          this.getCategories()
        } else {
          this.$message.error('删除失败!')
        }
      }).catch(() => {
        this.$message.info('取消操作!')
      })
    },
    handleSizeChange (newSize) {
      this.pageSize = newSize
    },
    handleCurrentChange (newPage) {
      this.pageNum = newPage
    }
  }
}
</script>

<style>
</style>