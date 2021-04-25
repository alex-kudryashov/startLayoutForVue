import './index.html'
import './css/index.scss'
import './js/index.js'
import Vue from 'vue/dist/vue.js'

let app = new Vue({
    el: '#app',
    data: {
        message: 'Привет, VueJS!'
    }
})