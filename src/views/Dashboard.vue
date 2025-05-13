<script setup>
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'


</script>

<template>
  <Sidebar />
  <main class="min-h-screen">
    <section id="main" class="w-full">
      <div class=" ">
        <Header/>
        <div class="lg:ml-[362px] 2xl:ml-[362px] my-[24px]">
          <router-view></router-view>
        </div>
      </div>
    </section>
  </main>
</template>