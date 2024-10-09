function loginQuery(object){
    let uNameInput = object.username;

    queryStr = "SELECT password FROM <table_name> WHERE username=" + uNameInput;
    return queryStr;
}