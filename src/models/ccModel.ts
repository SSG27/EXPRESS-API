import { model } from "mongoose";
import ccSchema from "../schemas/ccSchema";

const CCode = model('codes', ccSchema)

export default CCode;