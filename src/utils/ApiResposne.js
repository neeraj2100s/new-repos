class ApiResponse{
    constructor(statusCode,data,messege="succecss"){
        this.statusCode=statusCode
        this.data=data
        this.messege=messege
        this.success=statusCode<400
    }
    
}