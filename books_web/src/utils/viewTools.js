import { Message } from 'element-ui'
export const successTip = (msg, show) => {
  Message({
    message: msg,
    type: 'success',
    showClose: show | false
  })
}
export const errorTip = (msg, show) => {
  Message({
    message: msg,
    type: 'warning',
    showClose: show | false
  })
}
export const infoTip = (msg, show) => {
  Message({
    message: msg,
    type: 'info',
    showClose: show | false
  })
}