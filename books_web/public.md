## 经常要用到的代码
```js

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