import { Schema } from "mongoose";

const ccSchema = new Schema({
    code: {type: String, required:true, unique:true},
    country: {type: String, required:true},
    services: {type: [Number], required:true, default:[]},
})

export default ccSchema;