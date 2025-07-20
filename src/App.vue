
<script setup>
import  navBar  from "./components/navBar.vue"
import   bottomBar  from "@/views/homepage/content/footer/index.vue"
</script>

<template>
  <navBar/>
  <RouterView />
  <bottomBar/>
</template>

<style scoped  lang="scss"></style>
