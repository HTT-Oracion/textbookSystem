export const getItem = (name) => {
  let data = window.sessionStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (error) {
    return data
  }
}

export const setItem = (name, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.sessionStorage.setItem(name, value)
}
export const clearStorage = () => {
  window.sessionStorage.clear()
}