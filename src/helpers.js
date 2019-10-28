export function getClassForSelection(selection) {
    switch (parseInt(selection)) {
      case 0:
        return "is-info";
      case 1:
        return "is-success"
      case 2:
        return "is-warning";
      case 3:
        return "is-danger";
      default:
        return "is-info"
    }
  }

  


 export function getTextForSelection(selection){
    switch (parseInt(selection)) {
      case 0:
        return "Nothing selected. Please select an option";
      case 1:
        return "You've Accepted our invitation. See you there!"
      case 2:
        return "You've Selected Maybe. Thank you(?)";
      case 3:
          return "You've Selected Decline. We are sorry you won't be joining";
      default:
          return "Nothing selected. Please select an option";
    }
  }

  export function isObjectEmpty(obj){
   return  Object.keys(obj).length === 0 && obj.constructor === Object;
  }

 export function validateEmail(email) {
   console.log(email)
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}