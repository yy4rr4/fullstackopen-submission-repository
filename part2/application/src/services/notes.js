import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => {
    return axios.get(baseUrl)
}

const create = (newPersonObj) => {
    return axios.post(baseUrl, newPersonObj)
}

const deleteByID = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const put = (id, changedPerson) => {
    return axios.put(`${baseUrl}/${id}`, changedPerson)
}

export default { getAll, create, deleteByID, put}