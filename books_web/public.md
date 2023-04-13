## 经常要用到的代码
```js
/* level
0 系统管理员
1 教材管理员
2 订购员
3 审批员
4 普通用户
*/
import { user} from '@/api/user'
import {errorTip,successTip,infoTip} from '@/utils/viewsTool'

  this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(111);
        this.$message.success('删除成功!')
        this.getBookList()
      })
```

 <el-dialog title="编辑教材" :visible.sync="editBookVisible" width="50%">
    
  </el-dialog>




  ```
  
  ```