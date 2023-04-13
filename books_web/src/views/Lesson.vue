<template>
  <div class="lesson-page">
    <el-card>
      <my-bread nameOne="教学管理" nameTwo="课程列表"></my-bread>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getLessonList" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getLessonList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addLesson = true">添加</el-button>
        </el-col>
      </el-row>
      <el-table :data="lessonList" border stripe v-loading="loading">
        <el-table-column prop="id" label="课程编号"></el-table-column>
        <el-table-column prop="lesson_name" label="课程名称"></el-table-column>
        <el-table-column prop="class.cls_name" label="班级名称"></el-table-column>
        <el-table-column prop="major.major_name" label="专业名称"></el-table-column>
        <el-table-column prop="department.dep_name" label="院系名称"></el-table-column>
        <el-table-column prop="teacher_num" label="老师人数"></el-table-column>
        <el-table-column prop="class.total" label="学生人数"></el-table-column>
        <el-table-column prop="started" label="开课时间"></el-table-column>
        <el-table-column prop="charge" label="订购员">
          <template #default="scoped">
            <span v-if="scoped.row.chargeId">
              {{
              scoped.row.charge.username
              }}
            </span>
            <el-tag v-else type="danger">未订购</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approval" label="审批人">
          <template #default="scoped">
            <span v-if="scoped.row.approvalId">
              {{
              scoped.row.approval.username
              }}
            </span>
            <el-tag v-else type="danger">未审批</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="book.book_name" label="教材名称"></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scoped">
            <el-button type="primary" size="small" @click="toEdit(scoped.row)">编辑</el-button>
            <!--  :disabled="btnVisible || scoped.row.chargeId !== null" -->
            <el-button type="success" size="small" @click="charge(scoped.row.id, user.id, scoped.row)">订购</el-button>
            <!-- :disabled="btnVisible || scoped.row.chargeId !== null" -->
            <!-- <el-button
              type="danger"
              size="small"
              @click="approval(scoped.row.id, user.id, scoped.row)"
              >审批</el-button
            >-->
            <!-- v-if="user.level === 3" -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- add -->
    <el-dialog title="添加" :visible.sync="addLesson" width="50%">
      <el-form ref="addRef" :model="addForm" :rules="addLessonRules" label-width="100px">
        <el-form-item label="课程编号" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="lesson_name">
          <el-input v-model="addForm.lesson_name"></el-input>
        </el-form-item>

        <el-form-item label="院系名称" prop="departmentId">
          <el-select v-model="addForm.departmentId" placeholder="请选择">
            <el-option v-for="item in departmentList" :key="item.id" :label="item.dep_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业名称" prop="majorId">
          <el-select v-model="addForm.majorId" placeholder="请选择">
            <el-option v-for="item in majorList" :key="item.id" :label="item.major_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称" prop="classId">
          <el-select v-model="addForm.classId" placeholder="请选择">
            <el-option v-for="item in classList" :key="item.id" :label="item.cls_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老师人数" prop="teacher_num">
          <el-input v-model.number="addForm.teacher_num"></el-input>
        </el-form-item>
        <el-form-item label="开课时间" prop="started">
          <el-input v-model="addForm.started" placeholder="格式为 2020/02/02"></el-input>
        </el-form-item>
        <el-form-item label="教材用书" prop="bookId">
          <el-select v-model="addForm.bookId" placeholder="请选择">
            <el-option v-for="item in bookList" :key="item.id" :label="item.book_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="reset('addRef')">取 消</el-button>
        <el-button type="primary" @click="confirmAddLesson">确 定</el-button>
      </span>
    </el-dialog>
    <!-- edit -->
    <el-dialog title="编辑课程信息" :visible.sync="editLessonVisible" width="50%">
      <el-form ref="editLessonRef" :model="postForm" label-width="100px">
        <el-form-item label="课程名称">
          <el-input v-model="postForm.lesson_name"></el-input>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input v-model="postForm.class.cls_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="专业编号">
          <el-input v-model="postForm.major.major_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="院系名称">
          <el-input v-model="postForm.department.dep_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="教材用书">
          <el-select v-model="postForm.bookId" placeholder="请选择">
            <el-option v-for="item in bookList" :key="item.index" :label="item.book_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="老师人数">
          <el-input v-model="postForm.teacher_num"></el-input>
        </el-form-item>
        <el-form-item label="学生">
          <el-input v-model="postForm.class.total" disabled></el-input>
        </el-form-item>
        <el-form-item label="班长">
          <el-input v-model="postForm.class.monitor" disabled></el-input>
        </el-form-item>
        <el-form-item label="班长联系方式">
          <el-input v-model="postForm.class.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="postForm.book.price" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="totalNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="总价">
          <el-input v-model="totalPrice" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
        <el-button @click="editLessonVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditLesson">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllListApi } from '@/api/information'
import { getLessonsApi, getLessonById, editLessonApi, addLessonApi } from '@/api/lesson'
import { addOrderApi, getOrderById } from '@/api/order'
import { pageMixin } from '@/mixin'
import { addLessonRules } from '@/utils/validateRules'
export default {
  name: 'Lesson',
  mixins: [pageMixin],
  data () {
    return {
      lessonList: [],
      bookList: [],
      classList: [],
      majorList: [],
      departmentList: [],
      addForm: {
        id: '',
        teacher_num: 0,
        majorId: '',
        classId: '',
        bookId: '',
        departmentId: '',
        started: '',
        lesson_name: ''
      },
      addLessonRules,
      postForm: {
        class: {},
        book: {},
        department: {},
        major: {},
        approval: {},
        charge: {}
      },
      totalPrice: 0,
      addLesson: false,
      editLessonVisible: false,
      loading: false
    }
  },
  computed: {
    totalNum () {
      let newTotal = 0
      if (this.postForm === {}) {
        newTotal = 0
        this.totalPrice = 0
      } else {
        newTotal = parseInt(this.postForm.class.total) + parseInt(this.postForm.teacher_num)
        this.totalPrice = newTotal * parseInt(this.postForm.book.price)
      }
      return newTotal
    },
    btnVisible () {
      if (this.user.level === 2 || 0) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    'queryInfo.pageNum': function (val, oldVal) {
      this.getLessonList()
    },
    'queryInfo.pageSize': function (val, oldVal) {
      this.getLessonList()
    },
  },
  created () {
    this.getLessonList()
    this.getAllData()
  },
  methods: {
    async getAllData () {
      const { data: dep } = await getAllListApi('Department')
      const { data: maj } = await getAllListApi('Major')
      const { data: cls } = await getAllListApi('Class')
      const { data: book } = await getAllListApi('Book')
      this.bookList = book.result
      this.classList = cls.result
      this.majorList = maj.result
      this.departmentList = dep.result
    },
    async getLessonList () {
      const { data } = await getLessonsApi(this.queryInfo)
      this.lessonList = data.result
      this.total = data.result.length
      console.log(this.lessonList);
    },
    async toEdit (row) {
      if (this.user.level !== 0 && this.user.level !== 2) return this.$message.error('没有操作权限！')
      if (row.chargeId !== null) {
        return this.$message.error('已经订购过了，无法修改！')
      }
      const { data: res } = await getLessonById(row.id)
      this.postForm = res.result
      this.editLessonVisible = true
    },
    // 确认添加
    async confirmAddLesson () {
      const { data } = await addLessonApi(this.addForm)
      console.log(data);
      if (data.status !== 201) {
        this.$message.error('添加失败!')
      } else {
        this.$message.success('添加成功!')
        this.getLessonList()
      }
      this.addLesson = false
    },
    toAdd () { },
    // 确认订购
    async charge (id, chargeId, postForm) {
      console.log(postForm);
      if (this.user.level !== 0 && this.user.level !== 2) return this.$message.error('没有操作权限！')

      if (postForm.chargeId !== null) {
        return this.$message.error('已经订购过了，无法修改！')
      }
      this.$confirm('确认订购, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(async () => {
        const { data: res } = await editLessonApi(id, { chargeId })
        if (res.status === 200) {
          this.$message.success('确认审核成功!')
          this.loading = true
          const { data: lesson } = await addOrderApi({ ...postForm, chargeId })
          if (lesson.status === 201) {
            this.$notify.success({
              title: '结果信息',
              message: '已生成新的订单！',
              showClose: false
            });
            this.loading = false
            this.getLessonList()
          }
        } else {
          this.$message.error('确认订购失败!')
        }
      }).catch(() => {
        this.$message.info('取消操作')
      })
    },
    async confirmEditLesson () {
      // console.log(this.postForm)
      const { bookId, teacher_num, lesson_name } = this.postForm
      const { data } = await editLessonApi(this.postForm.id, { bookId, teacher_num, lesson_name })
      if (data.status === 200) {
        this.$message.success('修改成功!')
        this.getLessonList()
      } else {
        this.$message.error('修改失败!')
      }
      this.$refs.editLessonRef.resetFields()
      this.editLessonVisible = false
    },
    reset (ref) {
      this.$refs[ref].resetFields()
      this.editLessonVisible = false
      this.addLesson = false
    }
  }
}
</script>

<style>
</style>