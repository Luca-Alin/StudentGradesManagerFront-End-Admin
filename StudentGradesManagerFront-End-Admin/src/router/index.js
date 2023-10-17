import { createRouter, createWebHistory } from 'vue-router'
import Login from "@/views/Login.vue";
import FacultyManager from "@/views/FacultyManager.vue";
import StudentManager from "@/views/StudentManager.vue";
import GradesManager from "@/views/GradesManager.vue";
import CourseManager from "@/views/CourseManager.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'LoginView',
      component: Login
    },
    {
      path: '/faculty-manager',
      name: 'FacultyManagerView',
      component: FacultyManager
    },
    {
      path: '/student-manager',
      name: 'StudentManagerView',
      component: StudentManager
    },
    {
      path: '/grades-manager',
      name: 'GradeManagerView',
      component: GradesManager
    },
    {
      path: '/course-manager',
      name: 'CourseManagerView',
      component: CourseManager
    }
  ]
})

export default router
