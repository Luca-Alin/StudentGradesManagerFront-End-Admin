<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'GradeManagerView'
})
</script>

<script setup>

import {onMounted, ref} from "vue";
import {studentsController} from "@/controllers/students";
import {facultyController} from "@/controllers/faculties";
import {coursesController} from "@/controllers/courses";
import {gradesController} from "@/controllers/grades";
import axios from "axios";
import token from "@/token/token";

const SC = studentsController();
const FC = facultyController();
const CC = coursesController();
const GC = gradesController();

const year = ref(null);
const selectedFacultyId = ref(null);
const selectCourseId = ref(null);
const studentAndGrade = ref([]);

const getStudents = async () => {
  if (year.value == null ||
      selectedFacultyId.value == null) return;
  else if (selectCourseId.value == null) {
    await getCourses();
    return;
  }

  SC.setFacultyId(selectedFacultyId.value);
  await SC.fetchStudentsByFaculty();
  await getStudentGrades();
}
const getStudentGrades = async () => {
  studentAndGrade.value = [];

  let a = [];
  for (let i = 0; i < SC.students.length; i++) {
    GC.setStudentId(SC.students[i].id);
    GC.setCourseId(selectCourseId.value);
    a.push({
      student: {
        id: SC.students[i].id,
        firstName: SC.students[i].firstName,
        lastName: SC.students[i].lastName
      },
      grade: await GC.fetchGradeByCourseIdAndStudentId()
    });
  }

  a.forEach(s => {
    studentAndGrade.value.push({
      id: s.student.id,
      firstName: s.student.firstName,
      lastName: s.student.lastName,
      grade: {
        id: s.grade.id,
        grade: s.grade.value
      }
    });
  })
};

const getCourses = () => {
  CC.facultyId = selectedFacultyId.value;
  CC.year = year.value;
  CC.fetchCoursesByFacultyAndYear();
}

const updateGrade = async (studentId) => {
  let value = prompt("Enter new grade");
  await axios.put(`http://localhost:5196/api/grade/update/${selectCourseId.value}/${studentId}/${value}`, {}, {
    headers: {
      "Authorization": "bearer " + token.value
    }
  }).then(res => {
    console.log(res.data);
  }).catch(err => {
    console.log(err);
  }).finally(() => {
    getStudentGrades();
  });
}

onMounted(() => {
  FC.fetchAllFaculties();
})
</script>

<template>

  <header>

    <select v-model="selectedFacultyId" @change="getStudents">
      <option
          v-for="faculty in FC.faculties.value"
          :key="faculty.id"
          :value="faculty.id"
      >
        {{ faculty.name }}
      </option>
    </select> |

    <select v-model="year" @change="getStudents">
      <option
          v-for="i in [1,2,3,4,5,6,7]"
      >
        {{ i }}
      </option>
    </select> |

    <select v-model="selectCourseId" @change="getStudents">
      <option
          v-for="course in CC.courses.value"
          :key="course.id"
          :value="course.id"
      >
        {{ course.name }}
      </option>
    </select>

  </header>

  <br>

  <main>
    <table>
      <tr>
        <th>Student Id</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Grade</th>
        <th><h3>Update</h3></th>
      </tr>
      <tr v-for="s in studentAndGrade" :key="s.id">
        <td> {{ s.id }}</td>
        <td> {{ s.firstName }}</td>
        <td> {{ s.lastName }}</td>
        <td> Grade: {{ s.grade.grade }}</td>
        <td>
          <button @click="updateGrade(s.id)">Update</button>
        </td>

      </tr>
    </table>
  </main>


</template>

<style scoped>
table, th, td {
  border: 1px solid white;
  border-collapse: collapse;
  padding: 5px;
}

th, td {
  text-align: center;
  vertical-align: middle;
}

</style>