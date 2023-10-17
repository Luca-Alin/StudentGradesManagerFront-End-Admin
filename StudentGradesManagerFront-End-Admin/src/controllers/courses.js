import {defineStore} from "pinia";
import axios from "axios";
import token from "@/token/token";

export const coursesController = defineStore('courses', {
    state: () => ({
        courses: [],
        facultyId: null,
        year: 0,
        url: 'http://localhost:5196/api/course'
    }),

    actions: {
        setFaculty(facultyId) {
            this.facultyId = facultyId;
        },
        setYear(year) {
            this.year = year;
        },
        async fetchCoursesByFacultyAndYear() {
            await axios.get(this.url + '/' + this.facultyId + '/' + this.year, {
                headers: {
                    "Authorization": "bearer " + token.value
                }
            })
                .then(async response => {
                    this.courses.value = response.data
                })
                .catch(error => {
                    console.log(error);
                });
        },
        // async updateFacultyName(faculty) {
        //     let newName = prompt("Enter new name", faculty.name)
        //     if (newName != null) {
        //         await axios.put(this.url + '/update', {
        //             id: faculty.id,
        //             name: newName
        //         }, {
        //             headers: {
        //                 "Authorization": "bearer " + token.value
        //             }
        //         })
        //             .then(async response => {
        //                 await this.fetchAllFaculties();
        //                 alert(response.data)
        //             })
        //             .catch(async error => {
        //                 await this.fetchAllFaculties();
        //                 console.log(error);
        //                 alert("Update failed!")
        //             });
        //     }
        // },
        // async deleteFaculty(faculty) {
        //     await axios.delete(this.url + '/delete', {
        //         headers: {
        //             Authorization: "bearer " + token.value
        //         },
        //         data: {
        //             id: faculty.id,
        //             name: faculty.name
        //         }
        //     }).then(async response => {
        //         await this.fetchAllFaculties();
        //         alert(response.data)
        //     })
        //         .catch(async error => {
        //             await this.fetchAllFaculties();
        //             alert(error)
        //         });
        // }
    }
})