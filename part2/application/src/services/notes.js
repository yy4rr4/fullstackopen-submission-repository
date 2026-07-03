import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = (newPersonObj) => {
  const request = axios.post(baseUrl, newPersonObj)
  return request.then((response) => response.data)
}

const deleteByID = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then((response) => response.data)
}

const put = (id, changedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, changedPerson)
  return request.then((response) => response.data)
}

export default { getAll, create, deleteByID, put }
