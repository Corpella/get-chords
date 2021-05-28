import { createWebHistory, createRouter } from "vue-router";

const routes = [
    {
        path: '/', name: 'home', component: () => import("../pages/Home.vue"),
        children: [
            { path: '/live', name: 'live', component: () => import("../views/Live.vue") },
            { path: '/recordings', name: 'recordings', component: () => import("../views/Recordings.vue") }
        ]
    },

]

const router = createRouter({ history: createWebHistory(), routes })

export default router