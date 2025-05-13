<template>
    <div
      class="flex justify-center items-center lg:justify-end min-h-screen"
      :style="{ backgroundImage: `url(${taxta})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }"
    >
      <div class="w-full max-w-md mx-[20px] lg:mx-0 lg:max-w-lg lg:min-h-screen p-8 space-y-8 bg-[#F6F6F6] shadow-lg rounded-lg">
        <div class="text-center xl:my-[20px] 2xl:my-[80px]">
          <router-link to="/" class="flex justify-center items-center">
            <div class="flex items-center justify-center mb-[40px] space-x-2">
                <h1 class="text-[32px] font-bold text-white bg-[#6167ED] px-[13px] rounded-full">K</h1>
                <p class="font-bold text-[24px]">KANBAN</p>
              </div>
          </router-link>
        </div>
  
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span class="block sm:inline">{{ error }}</span>
        </div>
  
        <div
          v-if="successMessage"
          class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span class="block sm:inline">{{ successMessage }}</span>
        </div>
  
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium">
              Your Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="email"
              class="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="example@example.com"
            />
          </div>
  
          <div>
            <label for="password" class="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              v-model="password"
              class="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-red-500">Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters</p>
          </div>
  
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autocomplete="new-password"
              required
              v-model="confirmPassword"
              class="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
  
          <div>
            <button
              type="submit"
              @click="register"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign Up
            </button>
          </div>
        </form>
  
        <!-- <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                or
              </span>
            </div>
          </div>
  
          <div class="mt-6">
            <button
              @click="handleGoogleSignIn"
              :disabled="loading"
              class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#6365EF] hover:bg-[#8065EF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <font-awesome-icon :icon="['fab', 'google']" class="mr-2 text-red-500" />
              Sign in with Google
            </button>
          </div>
        </div> -->
  
        <div class="text-center mt-4">
          <p class="text-sm">
            Already have an account?
            <router-link
              to="/login"
              class="ml-1 font-medium text-blue-600 hover:text-blue-500"
            >
              Sign In
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import {useRouter} from 'vue-router';
    import taxta  from "../../assets/login/taxta.jpg"

    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');

    const register = () => {
      createUserWithEmailAndPassword(getAuth(), email.value, password.value, confirmPassword.value)
        .then((userCredential) => {
          const user = userCredential.user;
            console.log('User registered:', user);
          router.push({ name: 'login' });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Error registering user:', errorCode, errorMessage);
        });
};

     const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(), provider)
        .then((result) => {
            const user = result.user;
            console.log('User signed in with Google:', user);
            router.push("/projects");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error signing in with Google:', errorCode, errorMessage);
        });
    }

  </script>