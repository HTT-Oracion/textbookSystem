// ajax封装
console.log(123)
const requestType = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}
const asyncAjax = (url, type, params) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(type || requestType.GET, url, true)

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('request success!!')
          resolve(xhr.responseText)
        } else {
          reject(new Error(`请求出错：${xhr.statusText}`))
        }
      }
    }
    xhr.send(null)
  })
}
asyncAjax('http://localhost:3333/user/list').then((res) => {
  console.log(res)
}).catch(err => console.log(err))
