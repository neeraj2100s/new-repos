class ApiResponse {
    constructor(statusCode, data, messege = "success") { 
        // Constructor function, jab bhi koi naya ApiResponse object create hota hai,
        // toh yeh constructor function call hota hai.

        this.statusCode = statusCode; 
        // 'statusCode' property set karta hai jo response ka status code hoga (e.g., 200, 404).
        
        this.data = data; 
        // 'data' property set karta hai jo actual response data hoga.
        
        this.messege = messege; 
        // 'messege' property set karta hai, default value "success" hai. 
        // Agar constructor call karte time koi value provide nahi ki jati, 
        // toh yeh default "success" assign karega.
        
        this.success = statusCode < 400; 
        // 'success' property true set karta hai agar 'statusCode' 400 se chhota ho.
        // Agar statusCode 400 ya usse bada hoga, toh success false set hoga,
        // jo indicate karta hai ki request successful nahi hui.
    }
}
