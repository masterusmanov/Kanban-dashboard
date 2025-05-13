<template>
  <div>
    <div class="flex justify-between items-center p-6">
      <h1 class="text-2xl font-medium text-gray-800">My Projects</h1>
      <button
        @click="isModalOpen = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1.5 text-sm flex items-center"
      >
        + Add new project
      </button>
    </div>

    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="py-2 px-4 border-b">O/N</th>
          <th class="py-2 px-4 border-b">Name</th>
          <th class="py-2 px-4 border-b">Date</th>
          <th class="py-2 px-4 border-b">Status</th>
          <th class="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(project, index) in projects"
          :key="project.id"
          @click="goToTasks(project)"
          class="hover:bg-gray-50 cursor-pointer"
        >
          <td class="py-2 px-4 border-b">{{ index + 1 }}</td>
          <td class="py-2 px-4 border-b"><router-link to="/tasks">{{ project.name }}</router-link></td>
          <td class="py-2 px-4 border-b capitalize">{{ project.date }}</td>
          <td class="py-2 px-4 border-b capitalize">{{ project.status }}</td>
          <td class="py-2 px-4 border-b space-x-4">
            <button @click.stop="edit(project)" class="text-blue-500 hover:underline"><i class='bx bx-edit-alt'></i></button>
            <button @click.stop="remove(project.id)" class="text-red-500 hover:underline"><i class='bx bx-trash' ></i></button>
          </td>
        </tr>
      </tbody>
    </table>

    <BaseModal :show="isModalOpen" @close="isModalOpen = false" @submit="saveProject">
      <div>
        <h2 class="text-lg font-semibold mb-2">{{ editingProject ? 'Edit Project' : 'New Project' }}</h2>
        <input v-model="projectForm.name" class="border p-2 w-full mb-2" placeholder="Project name" />
        <select v-model="projectForm.status" class="border p-2 w-full">
          <option value="started">Started</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input v-model="projectForm.date" type="date" class="my-4">
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../../firebase/firebase'
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore'

import BaseModal from '../../components/BaseModal.vue'

const router = useRouter()
const isModalOpen = ref(false)
const editingProject = ref(null)
const projectForm = ref({ name: '', status: 'started' })

const projects = ref([])
const projectCollection = collection(db, 'projects')

const fetchProjects = async () => {
  // localStorage dan foydalanuvchi ma'lumotini olish
  const userData = JSON.parse(localStorage.getItem('user')) || {}
  const uid = userData.uid || ''
  
  // Faqat joriy foydalanuvchiga tegishli proyektlarni olish
  const q = query(projectCollection, where("uid", "==", uid))
  const snapshot = await getDocs(q)
  
  projects.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

const saveProject = async () => {
  // localStorage dan foydalanuvchi ma'lumotini olish
  const userData = JSON.parse(localStorage.getItem('user')) || {}
  const uid = userData.uid || ''
  
  // Loyiha ma'lumotlarini tayyorlash (UID bilan birga)
  const projectData = { 
    ...projectForm.value,
    uid: uid,  // Foydalanuvchi UID sini qo'shish
    createdAt: new Date()  // Yaratilgan vaqtni ham qo'shish mumkin
  }

  if (editingProject.value) {
    const docRef = doc(db, 'projects', editingProject.value.id)
    await updateDoc(docRef, projectData)
  } else {
    await addDoc(projectCollection, projectData)
  }
  
  isModalOpen.value = false
  projectForm.value = { name: '', status: 'started' }
  editingProject.value = null
  await fetchProjects()
}

const edit = (project) => {
  editingProject.value = project
  projectForm.value = { ...project }
  isModalOpen.value = true
}

const remove = async (id) => {
  await deleteDoc(doc(db, 'projects', id))
  await fetchProjects()
}

const goToTasks = (project) => {
  localStorage.setItem('currentProjectName', JSON.stringify(project))
  router.push({ name: 'TaskBoard', params: { projectId: project.id } })
}

onMounted(fetchProjects)
</script>