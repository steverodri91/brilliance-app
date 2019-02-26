import axios from 'axios'

const contact = {
  find: async function(query){
    try {
      const resp = await axios.get(`/api/contacts/find?q=${query}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  },
  findByEmail: async function(email){
    try {
      const resp = await axios.get(`/api/contacts/find?email=${email}`)
      return resp.data
    } catch (e) {
      console.log(e)
    }
  }
}

export {
  contact
}
