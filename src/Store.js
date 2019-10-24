import Communicator from './Communicator';


export default class Store extends Communicator {
    constructor(name = "none", settings = {}) {
        super();

        this.remoteLoaded = false;

        this.data = [];
        this.name = name;
        this.settings = settings;
        console.log("Created Store " + name)

    }

    load() {
        console.log("loading for " + this.name)
        return new Promise((resolve, reject) => {
            if (!this.commands.load && !this.settings.inJSON) {
                reject("Load command not implemented");
            }


            if (this.commands.load && !this.settings.inJSON) {

                this.loadRemote().then((response) => {

                    if (response) {
                        this.data = response.data;
                        this.remoteLoaded = true;

                        if (!Array.isArray(this.data)) {
                            this.data = [];
                        }
                        resolve()
                    } else (
                        reject("remote error")
                    )


                }).catch(function (error) {
                    console.log(error);
                });
            }

            if (this.settings.inJSON) {
               
                try {
                    this.data = window.data[this.settings.JSONTable];
                  }
                  catch(error) {
                    console.error(error);
                  
                  }
                  
                if (!Array.isArray(this.data)) {
                    this.data = [];
                }
                resolve()

            }
        })

    }

    getData() {
        return this.data;
    }


    get(id) {

        return this.data.find((datum) => {

            return parseInt(datum.id, 10) == parseInt(id, 10);
        })
    }

    delete() {

        if (!this.commands.delete) {
            throw "Delete command not implemented"
        }

        this.deleteRemote({});
    }

    create(data) {



        return this.createRemote(data).then((response) => {

            this.data.unshift(response.data)
            return response;
        })
    }


    update(data) {

        var index = this.data.findIndex((datum) => { return parseInt(datum.id, 10) === parseInt(data.id, 10) });


        var entry = this.data[index];

        Object.assign(entry, data);
        this.data[index] = entry;


        return this.updateRemote(data);
    }









}