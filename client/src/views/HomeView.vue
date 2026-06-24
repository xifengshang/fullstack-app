<template>
    <div>
        <h1>Welcome to the Home Page</h1>
        <p>This is a simple home page.</p>
        <RouterLink to="/login">Go to LoginView</RouterLink>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<style scoped>
</style>