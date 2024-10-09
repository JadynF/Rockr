function createAcctQuery(object){
    let fNameIn = object.firstName;
    let lNameIn = object.lastName;
    let uNameIn = object.username;
    let passIn = object.password;
    let emailIn = object.email;
    let phoneNumIn = object.phoneNum;

    queryStr = "INSERT INTO <table_name> user(" + fNameIn + ", " + lNameIn + ", " + uNameIn + ", " + passIn + ", " + emailIn + ", " + phoneNumIn + ");";
    return queryStr;
}