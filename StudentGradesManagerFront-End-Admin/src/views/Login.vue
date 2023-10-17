<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LoginView'})
</script>

<script setup>

import {ref} from "vue";
import axios from "axios";
import token from "@/token/token";

const email = ref('')
const password = ref('')


const login = () => {
    axios.post('http://localhost:5196/api/Auth/admin/login', {
      email: email.value,
      password: password.value
    }).then((response) => {
      token.value = response.data
      console.log(response.data);
      alert("Login successful!")
    }, (error) => {
      console.log(error)
      alert("Login failed!")
    })
}
</script>

<template>
<form @submit.prevent="login">
  <label for="email">Email</label>
  <input type="text" id="email" name="email" placeholder="Your email" v-model="email">

  <br/>

  <label for="password">Password</label>
  <input type="password" id="password" name="password" placeholder="Your password" v-model="password">

  <br/>

  <input type="submit" value="Submit">
</form>
</template>

<style scoped>

</style>