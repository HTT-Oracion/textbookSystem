<template>
  <!-- 添加文章对话框 -->
  <el-dialog title="添加教材" :visible.sync="addVisible" width="50%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="addBookRef" :rules="addBookRules" :model="addBookForm" label-width="100px">
      <el-form-item prop="ISBN" label="isbn编号：">
        <el-input v-model="addBookForm.ISBN"></el-input>
      </el-form-item>
      <el-form-item prop="book_name" label="书名：">
        <el-input v-model="addBookForm.book_name"></el-input>
      </el-form-item>
      <el-form-item prop="author" label="作者：">
        <el-input v-model="addBookForm.author"></el-input>
      </el-form-item>
      <el-form-item prop="publish" label="出版社：">
        <el-input v-model="addBookForm.publish"></el-input>
      </el-form-item>
      <el-form-item prop="date" label="出版日期：">
        <el-input v-model="addBookForm.date" placeholder="格式为:2021/01/01"></el-input>
      </el-form-item>
      <el-form-item prop="price" label="单价(元)：">
        <el-input v-model.number="addBookForm.price"></el-input>
      </el-form-item>
      <el-form-item prop="nums" label="数量">
        <el-input v-model.number="addBookForm.nums"></el-input>
      </el-form-item>
      <el-form-item prop="category" label="类别：">
        <el-select v-model="addBookForm.category" placeholder="请选择">
          <el-option v-for="(item, index) in categories" :key="index" :label="item.cat_name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="btns">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirmAddBook">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { nanoid } from 'nanoid'
import { bookRules } from '@/utils/validateRules'
import { getCatesApi, addBookApi } from '@/api/book'
export default {
  name: 'AddBook',
  props: {
    addVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addBookForm: {
        ISBN: '',
        book_name: '',
        author: '',
        publish: '',
        date: '',
        price: 0,
        category: '',
        nums: ''
      },
      addBookRules: bookRules,
      categories: [],
    }
  },
  methods: {
    async getCategories () {
      const { data } = await getCatesApi()
      this.categories = data.result
    },
    confirmAddBook () {
      this.$refs.addBookRef.validate(async val => {
        if (!val) {
          return this.$message.error('请填写完整！')
        } else {
          this.$confirm('添加新的教材, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(async () => {
            const { data } = await addBookApi({ id: nanoid(), ...this.addBookForm })
            if (data.status === 201) {
              this.$message.success('添加成功!')
              this.$emit('update')
            } else {
              this.$message.error('添加失败!')
            }
            this.$emit('close')
          }).catch(() => {
            this.$message.info('取消操作!')
            this.$emit('close')
          })
        }
      })

    }
  },
  created () {
    this.getCategories()
  }
}
</script>

<style>
</style>