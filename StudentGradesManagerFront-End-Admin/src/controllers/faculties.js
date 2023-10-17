import {defineStore} from "pinia";
import axios from "axios";
import token from "@/token/token";

export const facultyController = defineStore('faculties', {
    state: () => ({
        faculties: [],
        url: 'http://localhost:5196/api/faculty'
    }),

    actions: {
        async fetchAllFaculties() {
            await axios.get(this.url + '/all', {
                headers: {
                    "Authorization": "bearer " + token.value
                }
            })
                .then(async response => {
                    this.faculties.value = response.data
                })
                .catch(error => {
                    console.log(error);
                });
        },
        async updateFacultyName(faculty) {
            let newName = prompt("Enter new name", faculty.name)
            if (newName != null) {
                await axios.put(this.url + '/update', {
                    id: faculty.id,
                    name: newName
                }, {
                    headers: {
                        "Authorization": "bearer " + token.value
                    }
                })
                    .then(async response => {
                        await this.fetchAllFaculties();
                        alert(response.data)
                    })
                    .catch(async error => {
                        await this.fetchAllFaculties();
                        console.log(error);
                        alert("Update failed!")
                    });
            }
        },
        async deleteFaculty(faculty) {
            await axios.delete(this.url + '/delete', {
                headers: {
                    Authorization: "bearer " + token.value
                },
                data: {
                    id: faculty.id,
                    name: faculty.name
                }
            }).then(async response => {
                await this.fetchAllFaculties();
                alert(response.data)
            })
                .catch(async error => {
                    await this.fetchAllFaculties();
                    alert(error)
                });
            }
    }
})