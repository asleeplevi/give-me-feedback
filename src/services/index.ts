import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://nlw-heat-give-me-feedback.herokuapp.com/'
})