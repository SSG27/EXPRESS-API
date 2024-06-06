import { Schema } from "mongoose";

const ssSchema = new Schema({
    id: {type: String, required:true, unique:true},
    name: {type: String, required:true},
    monthlyFee: {type: String, required:true, default:"£0.00"},
})

export default ssSchema;