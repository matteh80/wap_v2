import { apiClient } from '../axios.config'
import axios from 'axios'
import $ from 'jquery'

const {
  GET_ALL_JOBS,
  SAVE_JOB,
  REMOVE_JOB,
  APPLY_JOB
} = require('./actionTypes/jobs')

export function getAllJobs () {
  return (dispatch, getState) => {
    return axios.get('https://cv-maxkompetens.app.intelliplan.eu/JobAdGlobePages/Feed.aspx?pid=AA31EA47-FDA6-42F3-BD9F-E42186E5A960&version=2', {
      responseType: 'text'
    })
      .then((result) => {
        let jobs = []
        let xml = $.parseXML(result.data)
        console.log(xml)
        let $xml = $(xml)
        $xml.find('item').each(function (index, elem) {
          let mJob = {
            id: $(elem).find('id').text(),
            title: $(elem).find('title').text(),
            pubdate: $(elem).find('pubdate').text(),
            description: $(elem).find('description').text(),
            type: $(elem).find('type').text(),
            servicecategory: $(elem).find('servicecategory').text(),
            state: $(elem).find('state').text(),
            municipality: $(elem).find('municipality').text(),
            company: $(elem).find('company').text(),
            contact1name: $(elem).find('contact1name').text(),
            contact1email: $(elem).find('contact1email').text(),
            contact1phone: $(elem).find('contact1phone').text()
          }
          jobs.push(mJob)
        })

        console.log(jobs)

        return dispatch({
          type: GET_ALL_JOBS,
          allJobs: jobs,
          receivedAt: Date.now()
        })
      })
  }
}

export function saveJob (job) {
  return (dispatch, getState) => {
    return dispatch({
      type: SAVE_JOB,
      jobtoSave: job,
      saveDate: Date.now()
    })
  }
}