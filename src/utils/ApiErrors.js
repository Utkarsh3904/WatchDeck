class ApiErros {
    constructors(statusCode, message="Something went Worng", errors=[], statck="" ){

        super( message )  //super used to overwrite message
        this.statuscode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors= errors
 
        //can avoid this
        if (statck){
            this.statck = statck
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {ApiError}