<template>
    <div
      class="flex justify-center items-center lg:justify-end min-h-screen"
      :style="{ backgroundImage: `url(${taxta})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }"
      
    >
      <div class="w-full max-w-md mx-[20px] lg:mx-0 lg:max-w-lg lg:min-h-screen p-8 space-y-8 bg-[#F6F6F6] shadow-lg rounded-lg">
        <div class="text-center lg:my-[20px] xl:my-[40px] 2xl:my-[100px]">
          <router-link to="/" class="flex justify-center items-center">
            <div class="flex items-center justify-center mb-[40px] space-x-2">
                <h1 class="text-[32px] font-bold text-white bg-[#6167ED] px-[13px] rounded-full">K</h1>
                <p class="font-bold text-[24px]">KANBAN</p>
              </div>
          </router-link>
        </div>
  
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium">
              Your email
              <span class="text-red-500">*</span>
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
            <label
              for="password"
              class="block text-sm font-medium text-black flex justify-between"
            >
              <span>Your password</span>
              <router-link
                to="/forgot-password"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot password?
              </router-link>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="password"
              class="mt-1 text-black block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <p v-if="errMsg" class="text-red-500 text-sm">{{errMsg}}</p>
          <div>
            <button
              type="submit"
              @click="login"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
            </button>
          </div>
        </form>

        <div class="mt-6">
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
                class="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#6365EF] hover:bg-[#8065EF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign in with Google
              </button>
            </div>
          </div>
  
       
        <div class="text-center mt-4">
          <p class="text-sm">
            Don't have an account?
            <router-link
              to="/register"
              class="ml-1 font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
   import { ref } from 'vue';
    import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import {useRouter} from 'vue-router';
    import taxta  from "../../assets/login/taxta.jpg"

    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const errMsg = ref();

    const login = () => {
        const auth = getAuth();
        if (email.value === '' || password.value === '') {
          errMsg.value = 'Please fill in all fields';
          return;
        }
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('User logged:', user);
            sessionStorage.setItem('user', JSON.stringify(user));
          router.push("/projects");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode){
            case 'auth/user-not-found':
              errMsg.value = 'User not found';
              break;
            case 'auth/wrong-password':
              errMsg.value = 'Wrong password';
              break;
            case 'auth/invalid-email':
              errMsg.value = 'Invalid email';
              break;
            default:
              errMsg.value = 'An error occurred';
          } 
        });
};

const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(), provider)
        .then((result) => {
            const user = result.user;
          console.log('User signed in with Google:', user);
            sessionStorage.setItem('user', JSON.stringify(user));
            router.push("/projects");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error signing in with Google:', errorCode, errorMessage);
        });
    }
  </script>