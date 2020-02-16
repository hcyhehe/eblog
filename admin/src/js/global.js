const erp = erp || {}

erp.API_SECRET_KEY = 'eblogVue.2666'
erp.gaodeKey = '35982f18ea3de896092a670f25a11537'

const url = 'https://blog.allstackcoding.com/api'
//const url = 'http://localhost:8089/api'


const bg = url

erp.upload = bg + '/upload'

erp.login = bg + '/login'

erp.categoryList = bg + '/category/list'
erp.categoryAdd = bg + '/category/add'
erp.categoryEdit = bg + '/category/edit'
erp.categoryDel = bg + '/category/del'

erp.anounceInfo = bg + '/anounce/info'
erp.anounceEdit = bg + '/anounce/edit'

erp.artList = bg + '/art/list'
erp.artAdd = bg + '/art/add'
erp.artInfo = bg + '/art/info'
erp.artEdit = bg + '/art/edit'
erp.artDel = bg + '/art/del'


export default erp
