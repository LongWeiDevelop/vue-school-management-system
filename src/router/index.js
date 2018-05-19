import Vue from 'vue'
import Router from 'vue-router'
import Schools from '../components/Schools'
import TeachersGroup from '../components/TeachersGroup'
import EditGroup from '../components/EditGroup'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '',
      redirect: '/schools'
    },
    {
      path: '/schools',
      name: 'Schools',
      component: Schools
    },
    {
      path: '/teachers',
      name: 'teachers-group',
      component: TeachersGroup
    }
  ]
});

export default router
