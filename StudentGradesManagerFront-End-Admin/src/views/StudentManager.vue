<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'FacultyManagerView'
})
</script>

<script setup>
import {onMounted, ref} from "vue";
import {studentsController} from "@/controllers/students";
import token from "@/token/token";
import axios from "axios";
import FacultyManager from "@/views/FacultyManager.vue";
import {facultyController} from "@/controllers/faculties";

const sPassword = ref('');
const sFirstName = ref('');
const sLastName = ref('');
const sDateOfBirth = ref('');
const sPhoneNumber = ref('');
const email = ref('');
const sFaculties = ref([null])

const sCountry = ref('');
const sCity = ref('');
const sStreet = ref('');
const sNumber = ref('');


const showStudentCreator = ref(false);

const FC = facultyController();
const SC = studentsController();


const addStudent1 = () => {
  console.log('bearer ' + token.value)
  addStudent();
}
const clearForm = () => {
  email.value = '';
  sPassword.value = '';
  sFirstName.value = '';
  sLastName.value = '';
  sDateOfBirth.value = '';
  sPhoneNumber.value = '';
  sCountry.value = '';
  sCity.value = '';
  sStreet.value = '';
  sNumber.value = '';
  sFaculties.value = [null];
}

async function addStudent() {
  let currentFaculties = [];
  new Set(sFaculties.value).forEach(faculty => {
    let i = JSON.parse(faculty);
    if (i != null)
      currentFaculties.push({
        id: i.id, name: i.name
      })
  });

  axios.post('http://localhost:5196/api/student/add', {
    password: sPassword.value,
    firstName: sFirstName.value,
    lastName: sLastName.value,
    dateOfBirth: sDateOfBirth.value,
    phoneNumber: sPhoneNumber.value,
    email: email.value,
    address: {
      country: sCountry.value,
      city: sCity.value,
      street: sStreet.value,
      number: sNumber.value,
    },
    faculties: currentFaculties
  }, {
    headers: {
      "Authorization": "bearer " + token.value
    }
  })
      .then(async response => {
        await SC.fetchAllStudents()
        alert(response.data)
        clearForm()
      })
      .catch(error => {
        alert(error)
      });
}

const currentFaculty = ref(null);
const fetchByFaculty = async () => {
  let n = currentFaculty.value;
  await SC.setFacultyId(n);
  await SC.fetchStudentsByFaculty();
}

const removeStudent = async (student) => {
  confirm("Are you sure you want to remove " + sFirstName + " " + sLastName + "?")

  SC.setStudentToRemoveId(student.id);
  await SC.removeStudentById();
  await SC.fetchStudentsByFaculty();
}

onMounted(async () => {
  await SC.fetchAllStudents();
  await FC.fetchAllFaculties();
})
</script>

<template>
  <br>
  <button @click="showStudentCreator = !showStudentCreator">
    {{ !showStudentCreator ? 'Add Students' : 'Stop adding students' }}
  </button>
  <div v-if="showStudentCreator">
    <h3>Student Creator</h3>
    <form @submit.prevent="addStudent1">
      <table>
        <tr>
          <td>email:</td>
          <td><input v-model="email" type="email"></td>
        </tr>
        <tr>
          <td>password:</td>
          <td><input v-model="sPassword" type="text"></td>
        </tr>
        <tr>
          <td>firstName:</td>
          <td><input v-model="sFirstName" type="text"></td>
        </tr>
        <tr>
          <td>lastName:</td>
          <td><input v-model="sLastName" type="text"></td>
        </tr>
        <tr>
          <td>phoneNumber:</td>
          <td><input v-model="sPhoneNumber" type="text"></td>
        </tr>
        <tr>
          <td>dateOfBirth:</td>
          <td><input v-model="sDateOfBirth" type="date"></td>
        </tr>
        <tr>
          <td>address:</td>
          <td></td>
        </tr>
        <tr>
          <td>country:</td>
          <td><input v-model="sCountry" type="text"></td>
        </tr>
        <tr>
          <td>city:</td>
          <td><input v-model="sCity" type="text"></td>
        </tr>
        <tr>
          <td>street:</td>
          <td><input v-model="sStreet" type="text"></td>
        </tr>
        <tr>
          <td>number:</td>
          <td><input v-model="sNumber" type="text"></td>
        </tr>
        <tr>
        </tr>
        <tr v-for="i in sFaculties.length">
          <select v-model="sFaculties[i]">
            <option
                v-for="faculty in FC.faculties.value"
            >
              {{ faculty }}
            </option>
          </select>
        </tr>
        <tr>
          <td colspan="2">
            <button @click.prevent="() => {if (sFaculties.length > 1) sFaculties.pop();}">Add Less Faculties</button>
          </td>
        </tr>
      </table>
      <input type="submit">
    </form>
  </div>


  <br/>
  <br/>
  Sort
  <br/>
  <select v-model="currentFaculty"
          @change="fetchByFaculty"
  >
    <option
        v-for="faculty in FC.faculties.value"
        :key="faculty.id"
        :value="faculty.id"
    >{{ faculty.name }}
    </option>
  </select>
  <br/>
  <br/>

  <ol>
    <li
        v-for="s in SC.students"
    >
      <pre>
      id: {{ s.id }}
      firstname: {{ s.firstName }}
      lastname: {{ s.lastName }}
      email: {{ s.email }}
      phone number: {{ s.phoneNumber }}
      date of birth: {{ s.dateOfBirth }}
      address
        country: {{ s.address.country }}
        city: {{ s.address.city }}
        street: {{ s.address.street }}
        number: {{ s.address.number }}
      <button @click="removeStudent(s)">Remove {{ s.firstName.split('')[0] + '. ' + s.lastName }}</button>

      </pre>
    </li>
  </ol>
</template>

<style scoped>

</style>