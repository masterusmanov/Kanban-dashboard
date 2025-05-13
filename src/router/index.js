import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import MyTasks from '../views/MyTasks/MyTasks.vue'
import Login from '../views/Login/Login.vue'
import Register from '../views/Login/Register.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MyProjects from '../views/MyProjects/MyProjects.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Dashboard,
      children: [
        {
          path: "/tasks",
          name: "mytasks",
          component: MyTasks,
        },
        {
          path: "/projects",
          name: "projects",
          component: MyProjects,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
  ],
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => { 
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
        reject(null)
      );
    }
  );
}
router.beforeEach(async(to, from, next) => {
  if(to.matched.some((record) => record.meta.requiresAuth)) {
    if(await getCurrentUser()) {
      next();
    } else {
      alert("You need to login to access this page");
      next("/tasks")
    }
  } else {
    next();
  }
});

export default router
