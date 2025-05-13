<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center">
      <div class="bg-white rounded-md shadow-lg p-6 w-full max-w-md">
        <slot />
        <div class="text-right mt-4">
          <button class="px-4 py-1 bg-gray-300 rounded mr-2" @click="$emit('close')">Cancel</button>
          <button class="px-4 py-1 bg-indigo-600 text-white rounded" @click="$emit('submit')">Save</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
     defineProps({ show: Boolean })
  </script>
  