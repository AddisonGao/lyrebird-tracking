import axios from 'axios'

export const clearResult = () => {
    return axios({
      url: '/ui/plugin/tracking/clear'
    })
}

export const saveReport = () => {
    return axios({
        url: '/ui/plugin/tracking/report'
    })
}

export const loadTrackingList = () => {
    return axios({
        url: '/ui/plugin/tracking/result'
    })
}

export const viewDetail = (id) => {
    return axios({
      url: '/ui/plugin/tracking/content/'+id
    })
}

export const loadTrackingBase = () => {
    return axios({
        url: '/ui/plugin/tracking/base'
    })
}

export const loadGroupList = () => {
    return axios({
        url: '/ui/plugin/tracking/group'
    })
}

export const createGroupList = (group) => {
    return axios({
        url: '/ui/plugin/tracking/select',
        method: 'POST',
        data: {group: group}
    })
} 