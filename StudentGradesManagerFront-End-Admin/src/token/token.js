import {ref, watch} from "vue";

let token = ref(localStorage.getItem('token') || '')

watch(token, (newVal) => {
    console.log('token changed')
    localStorage.setItem('token', newVal)
}, {
    deep: true
})
export default token
