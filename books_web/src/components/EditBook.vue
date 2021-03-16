<template>
  <el-dialog
    title="编辑教材"
    :visible.sync="editBookVisible"
    width="50%"
    :before-close="handleClose"
    v-if="editBookVisible"
  >
    <el-form ref="editBookRef" :model="currentBook" label-width="100px">
      <el-form-item prop="id" label="id">
        <el-input v-model="currentBook.id" disabled></el-input>
      </el-form-item>
      <el-form-item prop="ISBN" label="isbn编号：">
        <el-input v-model="currentBook.ISBN" disabled></el-input>
      </el-form-item>
      <el-form-item prop="book_name" label="书名">
        <el-input v-model="currentBook.book_name"></el-input>
      </el-form-item>
      <el-form-item prop="author" label="作者">
        <el-input v-model="currentBook.author"></el-input>
      </el-form-item>
      <el-form-item prop="publish" label="出版社">
        <el-input v-model="currentBook.publish"></el-input>
      </el-form-item>
      <el-form-item prop="date" label="出版日期">
        <el-input v-model="currentBook.date"></el-input>
      </el-form-item>
      <el-form-item prop="price" label="价格">
        <el-input v-model="currentBook.price"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="btns">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirmEditBook">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getBookById, editBookApi } from '@/api/book'
export default {
  name: 'EditBook',
  props: {
    editBookVisible: {
      type: Boolean,
      default: false
    },
    currentBook: Object
  },
  data () {
    return {
      editkForm: {
        id: '',
        ISBN: '',
        book_name: '',
        author: '',
        publish: '',
        date: '',
        price: ''
      }
    }
  },
  methods: {
    async getBookDetail () {
      const { data } = await getBookById(this.id)
      console.log(data);
    },
    async confirmEditBook () {
      this.$confirm('修改教材信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        const { id } = this.currentBook
        const { data } = await editBookApi(id, this.currentBook)
        if (data.status === 200) {
          this.$message.success('编辑成功!')
          this.$emit('update')
        } else {
          this.$message.error('编辑失败!')
        }
        this.$emit('close')
      }).catch(() => {
        this.$message.info('取消操作!')
        this.$emit('close')
      });
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style>
</style>