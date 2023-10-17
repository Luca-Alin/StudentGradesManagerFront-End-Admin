import {defineStore} from "pinia";
import axios from "axios";
import token from "@/token/token";

export const studentsController = defineStore('students', {
    state: () => ({
        students: [],
        facultyId: 0,
        studentToRemoveId: 0
    }),
    actions: {
        async fetchAllStudents() {
            await axios.get('http://localhost:5196/api/student/all', {
                headers: {
                    Authorization: 'bearer ' + token.value
                }
            }).then(async result => {
                this.students = []
                result.data.forEach(student => {
                    this.students.push(student)
                })
                console.log('students -> ' + this.students)
            }).catch(error => {
                console.log(error);
                alert(error);
            })
        },
        async fetchStudentsByFaculty() {
            if (this.facultyId === 0) {
                await this.fetchAllStudents();
                return;
            }

            await axios.get('http://localhost:5196/api/student/byFaculty/' + this.facultyId, {
                headers: {
                    Authorization: 'bearer ' + token.value
                }
            }).then(async result => {
                this.students = []
                result.data.forEach(student => {
                    this.students.push(student)
                })
            }).catch(error => {
                console.log(error);
                alert(error);
            })
        },
        async removeStudentById() {
            await axios.delete('http://localhost:5196/api/student/delete/' + this.studentToRemoveId, {
                headers: {
                    Authorization: 'bearer ' + token.value
                }
            }).then(async result => {
                await this.fetchStudentsByFaculty();
                alert(result.data);
            }).catch(error => {
                this.fetchStudentsByFaculty();
                alert(error);
            })
        },
        setFacultyId(id) {
            this.facultyId = id;
        },
        setStudentToRemoveId(id) {
            this.studentToRemoveId = id;
        }
    }
})