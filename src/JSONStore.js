

export function get(table) {
    var data = {};
    try {
        data = window.data[table];
    }
    catch (error) {
        console.log(error)

    }
    if (data === undefined) {
        data = {};
    }

    return data;

}

export function set(table, data) {
    try {
        return window.data[table] = data;
    }
    catch (error) {
        console.error(error);

    }

    return {};
}

