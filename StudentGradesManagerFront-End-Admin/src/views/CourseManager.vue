<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'CourseManagerView'
})
</script>

<script setup>
import {studentsController} from "@/controllers/students";
import {facultyController} from "@/controllers/faculties";
import {coursesController} from "@/controllers/courses";
import {gradesController} from "@/controllers/grades";
import {onMounted, reactive, ref} from "vue";
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

const showCourseCreator = ref(false);

const getCourses = () => {
  if (year.value == null ||
      selectedFacultyId.value == null) return;

  CC.facultyId = selectedFacultyId.value;
  CC.year = year.value;
  CC.fetchCoursesByFacultyAndYear();
}

const code = ref('');
const name = ref('');
const courseType = ref('');
const courseTypeEnum = reactive([
  {name: 'Compulsory', id: 0},
  {name: 'Optional', id: 1},
  {name: 'Complementary', id: 2}
]);
const courseYear = ref(0);
const semester = ref(0);
const courseHours = ref(0);
const seminarHours = ref(0);
const laboratoryHours = ref(0);
const projectHours = ref(0);
const practiceHours = ref(0);
const examinationType = ref(0);
const examinationTypeEnum = reactive([
  {name: 'Exam', id: 0},
  {name: 'Colloquy', id: 1},
  {name: 'AdmittedOrRejected', id: 2}
]);
const credits = ref('');
const courseFaculty = ref(null)


async function addCourse() {

  let currentCourseType = courseTypeEnum.filter(e => e.name === courseType.value)[0].id;
  let currentExamType = examinationTypeEnum.filter(e => e.name === examinationType.value)[0].id;

  let currentFacultyId = JSON.parse(selectedFacultyId.value).id;
  let currentFacultyName = JSON.parse(selectedFacultyId.value).name;

  axios.post('http://localhost:5196/api/course/add', {
    faculty: {
      id: currentFacultyId,
      name: currentFacultyName
    },
    code: code.value,
    name: name.value,
    courseType: currentCourseType,
    year: courseYear.value,
    semester: semester.value,
    courseHours: courseHours.value,
    seminarHours: seminarHours.value,
    laboratoryHours: laboratoryHours.value,
    projectHours: projectHours.value,
    practiceHours: practiceHours.value,
    examinationType: currentExamType,
    credits: credits.value
  }, {
    headers: {
      "Authorization": "bearer " + token.value
    },
  },)
      .then(async response => {
        await SC.fetchAllStudents()
        alert(response.data)
        clearForm();
      })
      .catch(error => {
        alert(error)
      });
}

const clearForm =  () => {
  code.value = '';
  name.value = '';
  courseType.value = '';
  courseYear.value = '';
  semester.value = '';
  courseHours.value = '';
  seminarHours.value = '';
  laboratoryHours.value = '';
  projectHours.value = '';
  practiceHours.value = '';
  examinationType.value = '';
  credits.value = '';
  courseFaculty.value = null;

}

onMounted(() => {
  FC.fetchAllFaculties();
})
</script>

<template>
  <h1>Course Manager View!</h1>

  <button @click="showCourseCreator = !showCourseCreator">
    {{ !showCourseCreator ? 'Add Course' : 'Stop Adding Courses' }}
  </button>
  <div v-if="showCourseCreator">
    <h3>Student Creator</h3>
    <form @submit.prevent="addCourse">
      <table>

        <tr>
          <td>code:</td>
          <td><input v-model="code" type="text"></td>
        </tr>

        <tr>
          <td>name:</td>
          <td><input v-model="name" type="text"></td>
        </tr>

        <tr>
          <td>Course Type:</td>
          <td>
            <select v-model="courseType">
              <option v-for="c in courseTypeEnum">{{c.name}}</option>
            </select>
          </td>
        </tr>

        <tr>
          <td>courseYear:</td>
          <td><input v-model="courseYear" type="number" min="1" max="10"></td>
        </tr>

        <tr>
          <td>semester:</td>
          <td><input v-model="semester" type="number" min="1" max="2"></td>
        </tr>

        <tr>
          <td>courseHours:</td>
          <td><input v-model="courseHours" type="number" min="0"></td>
        </tr>

        <tr>
          <td>seminarHours:</td>
          <td><input v-model="seminarHours" type="number" min="0"></td>
        </tr>

        <tr>
          <td>laboratoryHours:</td>
          <td><input v-model="laboratoryHours" type="number" min="0"></td>
        </tr>

        <tr>
          <td>practiceHours:</td>
          <td><input v-model="practiceHours" type="number" min="0"></td>
        </tr>

        <tr>
          <td>projectHours:</td>
          <td><input v-model="projectHours" type="number" min="0"></td>
        </tr>

        <tr>
          <td>examinationType:</td>
          <td>
            <select v-model="examinationType">
              <option v-for="e in examinationTypeEnum"> {{ e.name }}</option>
            </select>
          </td>
        </tr>

        <tr>
          <td>credits:</td>
          <td><input v-model="credits" type="number" min="0"></td>
        </tr>

        <tr>
          <select v-model="selectedFacultyId">
            <option
                v-for="faculty in FC.faculties.value"
            >
              {{ faculty }}
            </option>
          </select>
        </tr>


      </table>
      <input type="submit">
    </form>
  </div>

  <br>
  <br>
  <br>


  <div name="filterFaculties">
    <select v-model="selectedFacultyId" @change="getCourses">
      <option
          v-for="faculty in FC.faculties.value"
          :key="faculty.id"
          :value="faculty.id"
      >
        {{ faculty.name }}
      </option>
    </select> |

    <select v-model="year" @change="getCourses">
      <option
          v-for="i in [1,2,3,4,5,6,7]"
      >
        {{ i }}
      </option>
    </select>
  </div>


  <ul>
    <li v-for="course in CC.courses.value" :key="course.id">
      <pre>
      <a>course id: {{ course.id }}</a>
      Faculty:
        faculty id: {{ course.faculty.id }}
        faculty name: {{ course.faculty.name }}
      <a>code: {{ course.code }}</a>
      <a>name: {{ course.name }}</a>
      <a>courseType: {{ course.type }}</a>
          <a>year: {{ course.year }}</a>
      <a>semester: {{ course.semester }}</a>
      <a>courseHours: {{ course.courseHours }}</a>
      <a>seminarHours: {{ course.seminarHours }}</a>
      <a>courseHours: {{ course.courseHours }}</a>
      <a>laboratoryHours: {{ course.laboratoryHours }}</a>
      <a>projectHours: {{ course.projectHours }}</a>
      <a>practiceHours: {{ course.practiceHours }}</a>
      <a>examinationType: {{ course.examinationType }}</a>
      <a>credits: {{ course.credits }}</a>
      </pre>
      <br/>
    </li>
  </ul>

</template>

<style scoped>

</style>