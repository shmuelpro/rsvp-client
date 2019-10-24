import axios from 'axios';


export default class Communicator {
    constructor() {
        

    }


    Init(commands) {
        this.commands = commands;
    }

    loadRemote() {

        if (!this.commands.load) {
            throw "Load command not implemented"
        }




        return axios.get(this.commands.load).catch((error) => {
            console.log(error)
        });
    }

    deleteRemote(data) {

        if (!this.commands.delete) {
            throw "Delete command not implemented"
        }

        return axios.post(this.commands.delete, {...data }).catch((error) => {
            console.log(error)
        });
    }

    createRemote(data) {


        if (!this.commands.create) {
            throw "Create command not implemented"
        }
        console.log(this.commands.create)
        console.log(data)

        return axios.post(this.commands.create, { ... data }).catch((error) => {
            console.log(error)
        });
    }

    sendImage(imageFile, ID) {

        if (!this.commands.uploadimage) {
            throw "Upload Image command not implemented"
        }

        const data = new FormData();
        data.append('image', imageFile);

        data.append('id', ID);
        

        return axios.post(this.commands.uploadimage, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

    }


    updateRemote(data) {


        if (!this.commands.update) {
            throw "Update command not implemented"
        }
        console.log(data);

        return axios.put(this.commands.update+"/"+data.id, {...data }).catch((error) => {
            console.log(error)
        });

    }









}