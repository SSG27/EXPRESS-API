import {Router} from "express";
import CCode from "../models/ccModel"

const codesRouter = Router();

// codesRouter.post("/", (req, res) => {
//     res.send("create a country code")
// });

// codesRouter.get("/", (req, res) => {
//     res.send("get all 58 country codes")
// });

// codesRouter.get("/:code", (req, res) => {
//     res.send("get one country code by unique code")
// });

// codesRouter.patch("/:code", (req, res) => {
//     res.send("update one country code based on unique code")
// });

// codesRouter.delete("/:code", (req, res) => {
//     res.send("delete one country code based on unique code")
// });

codesRouter

export default codesRouter;