import axios from 'axios'

const API_URL = 'https://www.api.nahuefer.com/api/templates'
const TENANT_ID = '78cd60c9-e767-4d1e-b45d-6ba74f3742ee'

export async function getTemplates(page = 1, rowsPerPage = 15) {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                'Accept': 'application/json',
                'X-tenant': TENANT_ID
            },
            params: {
                page,
                rows_per_page: rowsPerPage
            }
        })
        return response.data
    } catch (error) {
        console.error('Error getting templates:', error)
        throw error
    }
}