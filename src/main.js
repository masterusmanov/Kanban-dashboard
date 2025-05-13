import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCEDxs2oPmsYiR0GXVspqJ0PnxBdFNNIxg",
  authDomain: "kanban-ffaee.firebaseapp.com",
  projectId: "kanban-ffaee",
  storageBucket: "kanban-ffaee.firebasestorage.app",
  messagingSenderId: "574617937146",
  appId: "1:574617937146:web:b8b03eac4d59bb14999543",
};

initializeApp(firebaseConfig);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
