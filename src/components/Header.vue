<template>
    <div class="bg-[#F6F6F6] h-[50px] flex items-center justify-end space-x-4 px-[20px] lg:px-[40px]">
        <i class='bx bx-user p-[7px] rounded-full bg-[#6365EF] text-white text-[28px]' ></i>
        <h1 class="text-[#6365EF] text-[18px] font-bold">{{userName}}</h1>
    </div>
</template>

<script setup>
const user = JSON.parse(sessionStorage.getItem('user'))
console.log(user.email);

let userName;
 
if(user.displayName){
    userName = user.displayName
}else{
    userName = user.email
}
</script>

<style lang="scss" scoped>

</style>