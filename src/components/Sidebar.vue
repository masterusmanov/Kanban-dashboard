<script setup>
import { ref, onMounted } from "vue";
import { navLinks } from "../constants/navLinks";
import { useRouter } from "vue-router";
import {getAuth, onAuthStateChanged, signOut} from "firebase/auth";

const navlink = ref(navLinks);
const router = useRouter();
const loggedIn = ref(false)

let auth;
onMounted(() => {
    auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      loggedIn.value = true;
    } else {
        loggedIn.value = false;
    }
  });
});

const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
      sessionStorage.clear();
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
};
</script>

<template>
  <div>

    <aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-80 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
    <div class="h-[100%] px-[20px] overflow-y-auto bg-[#F6F6F6] py-[40px]">
      <div class="flex items-center justify-center mb-[40px] space-x-2">
        <h1 class="text-[32px] font-bold text-white bg-[#6167ED] px-[13px] rounded-full">K</h1>
        <p class="font-bold text-[24px]">KANBAN</p>
      </div>
     
      <ul class="space-y-2 font-medium mt-[16px]">
        <li v-for="link in navlink" :key="link.id">
          <router-link
            :to="link.link"
            class="flex items-center p-2 rounded-lg text-[24px] text-[#616161] hover:text-[#FFFFFF] hover:bg-[#6167ED]"
          >
          <i :class="link.icon" class="text-[32px]"></i>
            <span class="ml-3">{{ link.title }}</span>
          </router-link>
        </li>
      </ul>

      <button
        @click="logout"
        class="block px-3 py-2 rounded-xl focus:ring-4 text-white bg-[#6167ED] absolute bottom-3 text-[20px] hover:text-red-600"
      >
      Выйти <i class="bx bx-log-out ml-5"></i>
      </button>
    </div>
    </aside>
  </div>
</template>

<style lang="css" scoped>
.router-link-exact-active {
  background-color: #6167ED;
  border: 1px solid #6167ED;
  color: #FFFFFF;
}
.router-link-exact-active:hover {
  color: #FFFFFF;
}
</style>