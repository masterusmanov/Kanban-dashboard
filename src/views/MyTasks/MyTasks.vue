<template>
    <div class="p-6">
      <h1 class="text-2xl font-semibold mb-4">Task Board</h1>
      <h2 class="text-lg font-semibold mb-6">{{ projectName?.name || 'Loyiha' }}</h2>
  
      <!-- Agar loyiha ID bo'lmasa yoki xatolik bo'lsa -->
      <div v-if="!projectId" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p class="font-bold">Xatolik!</p>
        <p>Loyiha ma'lumotlari topilmadi. Iltimos, loyihalar ro'yxatiga qaytib, loyihani qayta tanlang.</p>
        <router-link to="/projects" class="text-blue-600 hover:underline mt-2 inline-block">Loyihalar ro'yxatiga qaytish</router-link>
      </div>
  
      <!-- Ma'lumotlar yuklanayotgan vaqtda ko'rsatiladi -->
      <div v-if="isLoading" class="flex justify-center items-center h-40">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p class="ml-3">Ma'lumotlar yuklanmoqda...</p>
      </div>
  
      <div v-else-if="projectId" class="flex gap-6 overflow-x-auto">
        <div
          v-for="column in columns"
          :key="column.status"
          class="w-80 bg-gray-100 rounded-lg p-4 flex flex-col"
          @dragover.prevent
          @drop="onDrop(column.status)"
        >
          <h2 class="text-lg font-medium mb-3 capitalize bg-white p-4 text-black border-l-4 border-[#8065EF]">{{ column.title }}</h2>
  
          <div class="space-y-3 flex-1 min-h-[100px]">
            <div
              v-for="task in filteredTasks(column.status)"
              :key="task.id"
              class="bg-white p-3 rounded shadow text-sm cursor-move"
              draggable="true"
              @dragstart="onDragStart(task)"
            >
              <div class="flex justify-between">
                <span class="font-semibold">{{ task.title }}</span>
                <span
                  :class="{
                    'text-red-600': task.priority === 'high',
                    'text-yellow-600': task.priority === 'medium',
                    'text-green-600': task.priority === 'low',
                  }"
                >
                  • {{ task.priority }}
                </span>
              </div>
              <div class="text-xs mt-1 text-gray-600">{{ task.description }}</div>
              <div class="mt-2 flex gap-2 text-xs">
                <button @click="openEditModal(task)" class="text-blue-500 hover:underline"><i class='bx bx-edit-alt'></i></button>
                <button @click="openDeleteModal(task.id)" class="text-red-500 hover:underline"><i class='bx bx-trash'></i></button>
              </div>
            </div>
          </div>
  
          <button
            @click="openAddTaskModal(column.status)"
            class="mt-4 text-indigo-600 hover:underline text-sm self-start"
          >
            + Add task
          </button>
        </div>
      </div>
  
      <div class="flex justify-between mt-8">
        <button @click="refreshData" class="bg-indigo-500 text-white px-4 py-2 rounded-lg">
          <i class='bx bx-refresh mr-1'></i> Ma'lumotlarni yangilash
        </button>
      </div>
  
      <!-- Add Task Modal -->
      <div v-if="isAddModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-semibold mb-4">Add New Task</h2>
          <input v-model="newTask.title" type="text" placeholder="Task Title" class="w-full mb-4 p-2 border rounded" />
          <textarea v-model="newTask.description" placeholder="Task Description" class="w-full mb-4 p-2 border rounded"></textarea>
          <input type="date" v-model="newTask.date" class="w-full mb-4 p-2 border rounded" />
  
          <!-- Priority Dropdown -->
          <select v-model="newTask.priority" class="border p-2 w-full mb-4">
            <option value="low">Easy</option>
            <option value="medium">Medium</option>
            <option value="high">Hard</option>
          </select>
  
          <div class="flex gap-2 justify-end">
            <button @click="addTaskToFirestore" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button @click="closeAddTaskModal" class="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
  
      <!-- Edit Task Modal -->
      <div v-if="isEditModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-semibold mb-4">Edit Task</h2>
          <input v-model="editTaskData.title" type="text" class="w-full mb-4 p-2 border rounded" />
          <textarea v-model="editTaskData.description" class="w-full mb-4 p-2 border rounded"></textarea>
          <input type="date" v-model="editTaskData.date" class="w-full mb-4 p-2 border rounded" />
          <!-- Priority Dropdown -->
          <select v-model="editTaskData.priority" class="border p-2 w-full mb-4">
            <option value="low">Easy</option>
            <option value="medium">Medium</option>
            <option value="high">Hard</option>
          </select>
  
          <div class="flex gap-2 justify-end">
            <button @click="saveEditedTask" class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button @click="closeEditTaskModal" class="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div class="bg-white p-6 rounded-lg w-96">
          <h2 class="text-xl font-semibold mb-4">Are you sure you want to delete this task?</h2>
          <div class="flex gap-2 justify-end">
            <button @click="deleteTaskFromFirestore" class="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            <button @click="closeDeleteModal" class="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { db } from '../../firebase/firebase'
  import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot
  } from 'firebase/firestore'
  
  const route = useRoute()
  const router = useRouter()
  const isLoading = ref(true)
  
  // Loyiha ma'lumotlarini olish - yaxshilangan usul
  const projectName = ref(null)
  const projectId = ref(null)
  
  // SessionStorage'dan ma'lumotlarni olish funksiyasi
  const getProjectFromStorage = () => {
    try {
      const storedProject = sessionStorage.getItem('currentProjectName')
      if (storedProject) {
        const parsedProject = JSON.parse(storedProject)
        projectName.value = parsedProject
        projectId.value = parsedProject?.id || null
        console.log('Loyiha ma\'lumotlari:', parsedProject)
        return true
      }
      return false
    } catch (error) {
      console.error('Loyiha ma\'lumotlarini o\'qishda xatolik:', error)
      return false
    }
  }
  
  // URL dan loyiha ID olish (agar sessionStorage'da bo'lmasa)
  const getProjectFromUrl = () => {
    const urlProjectId = route.params.id
    if (urlProjectId) {
      projectId.value = urlProjectId
      // Bu yerda Firestore'dan loyiha ma'lumotlarini olish mumkin
      return true
    }
    return false
  }
  
  // Loyiha ma'lumotlarini aniqlash
  const initializeProject = () => {
    let success = getProjectFromStorage()
    
    if (!success) {
      success = getProjectFromUrl()
    }
    
    if (!success) {
      console.error('Loyiha ma\'lumotlari topilmadi!')
      projectName.value = { name: 'Noma\'lum loyiha', id: null }
      projectId.value = null
    }
    
    return success
  }
  
  const columns = ref([
    { status: 'todo', title: 'To Do' },
    { status: 'in-progress', title: 'In Progress' },
    { status: 'done', title: 'Done' }
  ])
  
  const tasks = ref([])
  const currentDragTask = ref(null)
  const taskCollection = collection(db, 'tasks')
  
  const newTask = ref({ 
    title: '', 
    description: '', 
    priority: 'medium',
    date: '',
    projectName: '' 
  })
  
  const editTaskData = ref({ 
    id: '', 
    title: '', 
    description: '', 
    priority: 'medium',
    date: '',
    projectName: '' 
  })
  
  const taskToDelete = ref(null)
  
  const isAddModalOpen = ref(false)
  const isEditModalOpen = ref(false)
  const isDeleteModalOpen = ref(false)
  
  // Ma'lumotlarni yangilash uchun real-time listener
  let unsubscribe = null
  
  // Loyiha ID bo'yicha vazifalarni olish - real-time listener bilan
  const setupTasksListener = () => {
    if (!projectId.value || !projectName.value?.name) {
      console.error('Loyiha ma\'lumotlari to\'liq emas, real-time tinglovchi o\'rnatilmadi')
      isLoading.value = false
      return
    }
    
    try {
      // Oldingi tinglovchini o'chirish
      if (unsubscribe) {
        unsubscribe()
      }
      
      // Yangi real-time tinglovchi o'rnatish
      const q = query(taskCollection, where('projectName', '==', projectName.value.name))
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        tasks.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        console.log(`Loyiha "${projectName.value?.name}" uchun ${tasks.value.length} ta vazifa yuklandi.`)
        isLoading.value = false
      }, (error) => {
        console.error('Real-time ma\'lumotlarni olishda xatolik:', error)
        isLoading.value = false
      })
      
    } catch (error) {
      console.error('Vazifalarni tinglovchisini o\'rnatishda xatolik:', error)
      isLoading.value = false
    }
  }
  
  // Oddiy vazifalarni olish (real-time listener o'rniga)
  const fetchTasks = async () => {
    if (!projectId.value || !projectName.value?.name) {
      console.error('Loyiha ma\'lumotlari to\'liq emas, vazifalar yuklanmadi')
      isLoading.value = false
      return
    }
    
    isLoading.value = true
    
    try {
      // Loyiha nomi bo'yicha vazifalarni filtrlash
      const q = query(taskCollection, where('projectName', '==', projectName.value.name))
      const snapshot = await getDocs(q)
      tasks.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log(`Loyiha "${projectName.value?.name}" uchun ${tasks.value.length} ta vazifa yuklandi.`)
    } catch (error) {
      console.error('Vazifalarni yuklashda xatolik:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // Status bo'yicha vazifalarni filtrlash
  const filteredTasks = (status) => {
    return tasks.value.filter((t) => t.status === status)
  }
  
  // Ma'lumotlarni yangilash uchun funksiya
  const refreshData = async () => {
    await fetchTasks()
  }
  
  // SessionStorage'ni tozalash
  const clearSessionStorage = () => {
    sessionStorage.removeItem('currentProjectName')
  }
  
  // Drag and drop funksiyalari
  const onDragStart = (task) => {
    currentDragTask.value = task
  }
  
  const onDrop = async (newStatus) => {
    if (currentDragTask.value) {
      try {
        const docRef = doc(db, 'tasks', currentDragTask.value.id)
        await updateDoc(docRef, { status: newStatus })
        currentDragTask.value = null
        // Real-time listener bo'lgani uchun ma'lumotlar avtomatik yangilanadi
      } catch (error) {
        console.error('Vazifa statusini yangilashda xatolik:', error)
      }
    }
  }
  
  // Modallarni ochish
  const openAddTaskModal = (status) => {
    newTask.value = {
      title: '', 
      description: '', 
      priority: 'medium',
      date: '',
      status: status,
      projectName: projectName.value?.name || ''
    }
    isAddModalOpen.value = true
  }
  
  const openEditModal = (task) => {
    editTaskData.value = { ...task }
    isEditModalOpen.value = true
  }
  
  const openDeleteModal = (taskId) => {
    taskToDelete.value = taskId
    isDeleteModalOpen.value = true
  }
  
  // Modallarni yopish
  const closeAddTaskModal = () => {
    isAddModalOpen.value = false
  }
  
  const closeEditTaskModal = () => {
    isEditModalOpen.value = false
  }
  
  const closeDeleteModal = () => {
    isDeleteModalOpen.value = false
    taskToDelete.value = null
  }
  
  // Firebase operatsiyalari
  const addTaskToFirestore = async () => {
    if (!newTask.value.title || !newTask.value.description) {
      alert('Iltimos, barcha maydonlarni to\'ldiring!')
      return
    }
  
    if (!projectId.value) {
      alert('Loyiha ID topilmadi! Iltimos sahifani qayta yuklang yoki boshqa loyihani tanlang.')
      return
    }
  
    try {
      const taskData = {
        projectId: projectId.value,
        projectName: projectName.value?.name || '',
        title: newTask.value.title,
        description: newTask.value.description,
        status: newTask.value.status,
        priority: newTask.value.priority,
        date: newTask.value.date || null,
        createdAt: new Date()
      }
      
      console.log('Yangi vazifa ma\'lumotlari:', taskData)
      await addDoc(taskCollection, taskData)
      // Real-time listener bo'lgani uchun ma'lumotlar avtomatik yangilanadi
      closeAddTaskModal()
    } catch (error) {
      console.error('Vazifa qo\'shishda xatolik:', error)
      alert('Vazifani qo\'shishda xatolik yuz berdi. Qayta urinib ko\'ring.')
    }
  }
  
  const saveEditedTask = async () => {
    if (!editTaskData.value.title || !editTaskData.value.description) {
      alert('Iltimos, barcha maydonlarni to\'ldiring!')
      return
    }
  
    try {
      const docRef = doc(db, 'tasks', editTaskData.value.id)
      await updateDoc(docRef, {
        title: editTaskData.value.title,
        description: editTaskData.value.description,
        priority: editTaskData.value.priority,
        date: editTaskData.value.date || null,
        updatedAt: new Date()
      })
      // Real-time listener bo'lgani uchun ma'lumotlar avtomatik yangilanadi
      closeEditTaskModal()
    } catch (error) {
      console.error('Vazifani yangilashda xatolik:', error)
      alert('Vazifani yangilashda xatolik yuz berdi.')
    }
  }
  
  const deleteTaskFromFirestore = async () => {
    try {
      await deleteDoc(doc(db, 'tasks', taskToDelete.value))
      // Real-time listener bo'lgani uchun ma'lumotlar avtomatik yangilanadi
      closeDeleteModal()
    } catch (error) {
      console.error('Vazifani o\'chirishda xatolik:', error)
      alert('Vazifani o\'chirishda xatolik yuz berdi.')
    }
  }
  
  // Projektni ma'lumotlarini nazorat qilish
  watch(() => projectId.value, (newId) => {
    if (newId) {
      setupTasksListener()
    }
  })
  
  // Sahifa yuklanganda loyiha ma'lumotlarini va vazifalarni yuklash
  onMounted(() => {
    const success = initializeProject()
    
    if (success) {
      // Yangilanuvchi ma'lumotlar uchun tinglovchini o'rnatish
      setupTasksListener()
    } else {
      // Ma'lumotlar topilmasa yuklanayotgan indikatorni o'chirish
      isLoading.value = false
    }
    
    // Komponent o'chirilganda tinglovchini tozalash
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  })
  </script>