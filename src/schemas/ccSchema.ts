import { Schema } from "mongoose";

const ccSchema = new Schema({
    code: {type: String, required:true, unique:true},
    country: {type: String, required:true},
    services: {type: [Number], required:true, default:[]},
})

export default ccSchema;

// create new confluence page abt database
// creatre databases
// create ts functions that support crud functions for ts
// create read update delete
// have a function where you provice it a streaming service id and it returns all the streaming services that support that id.
// this function can be my read function