import {defineStore} from "pinia";
import axios from "axios";
import token from "@/token/token";

export const gradesController = defineStore('grades', {
    state: () => ({
        faculties: [],
        courseId: 0,
        studentId: 0,
        url: 'http://localhost:5196/api/grade'
    }),
    actions: {
        setCourseId(courseId) {
            this.courseId = courseId;
        },
        setStudentId(studentId) {
            this.studentId = studentId;
        },
        async fetchGradeByCourseIdAndStudentId() {
            let grade = null;
            await axios.get(this.url + '/' + this.courseId + '/' + this.studentId, {
                headers: {
                    "Authorization": "bearer " + token.value
                }
            })
                .then(response => {
                    let i = response.data;
                    grade = {
                        id: i.id,
                        value: i.value
                    };
                })
                .catch(error => {
                    console.log(error);
                });
            return grade;
        }
    }
})