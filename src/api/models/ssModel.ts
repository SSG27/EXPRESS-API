import { model } from "mongoose";
import ssSchema from "../schemas/ssSchema";

const SService = model('streamingServices', ssSchema)

export default SService;