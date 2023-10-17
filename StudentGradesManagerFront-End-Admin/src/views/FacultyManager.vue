<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'FacultyManagerView'
})
</script>

<script setup>
import axios from "axios";
import token from "@/token/token";
import {onMounted, ref} from "vue";
import {facultyController} from "@/controllers/faculties";


const FC = facultyController();
const updateFacultyName = (faculty) => {
  FC.updateFacultyName(faculty);
}

const deleteFaculty = (faculty) => {
  FC.deleteFaculty(faculty)
}

const newFacultyName = ref('')
const createFaculty = async () => {
  axios.post('http://localhost:5196/api/faculty/add', {
    name: newFacultyName.value
  }, {
    headers: {
      "Authorization": "bearer " + token.value
    }
  })
      .then(async response => {
        FC.faculties.push(response.data)
        newFacultyName.value = ''
        alert(response.data)
        await FC.fetchAllFaculties();
      })
      .catch(async error => {
        alert(error)
        await FC.fetchAllFaculties();
      });
}
onMounted(() => {
  FC.fetchAllFaculties();
})
</script>

<template>

  <div>
    <h2>Faculty Creator</h2>
    <br/>
    <form @submit.prevent="createFaculty">
      <label for="facultyName">Faculty name</label> <br/>
      <input id="facultyName" v-model="newFacultyName" name="facultyName" placeholder="Faculty name" type="text"><br/>
      <input type="submit" value="Submit">
    </form>
  </div>

  <br/>
  <br/>

  <ol>
    <li v-for="faculty in FC.faculties.value" :key="faculty.id">
      id: {{ faculty.id }}
      <br/>
      faculty name: {{ faculty.name }}
      <button @click="updateFacultyName(faculty)">Update</button>
      <br/>
      <button @click="deleteFaculty(faculty)">Delete</button>
      <br/>
      <br/>
    </li>
  </ol>
</template>

<style scoped>

</style>