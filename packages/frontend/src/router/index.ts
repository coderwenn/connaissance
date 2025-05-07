import {createRouter, createWebHistory} from 'vue-router'

const routers = [
    {
        path: '/',
        component: () => import('../pages/ChatView/index.vue')
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes: routers
})

export default router