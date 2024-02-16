import {Router} from "express";
import SService from "../models/ssModel";
import CCode from "../models/ccModel";

const serviceRouter = Router();

serviceRouter.post("/newService", async (req, res) => {
    if (!req.body.id || !req.body.name) {
        return res.status(400).json({message: "id and name of streaming service required"})
    };

    const service = new SService({
        id: req.body.id,
        name: req.body.name,
        monthlyFee: req.body.monthlyFee,
    });
    const created = await service.save()

    res.status(201)
    res.json(created)
});





// serviceRouter.get("/", (req, res) => {
//     const query: any = {}
//     if(req.query.name !== undefined) {
//         // when you do .find just pass in the query object
//         query.name = new RegExp(`.*${req.query.name}.*`, `i`)
//         res.send("get streaming service with specified name")
//     }
//     if(req.query.name == undefined) {
//         res.send("get all 13 streaming services")
//     }
// });

// serviceRouter.get("/:id", (req, res) => {
//     res.send("get one streaming service by id")
// });

// get all streaming services with their monthly fee based on country code
serviceRouter.get("/", async (req, res) => {
    const countryCode = req.query.countryCode
    const countryCodeDocument = await CCode.findOne({ code: countryCode });

    if (!countryCodeDocument) {
        res.status(404)
        return res.send(`The country code ${countryCode} is not currently supported by our services.`);
    }
  
    const { services: serviceIds } = countryCodeDocument;
    const streamingServices = await SService.find({ id: { $in: serviceIds } }, { name: 1, monthlyFee: 1, _id: 0 });
  
    if (streamingServices.length === 0) {
        res.status(400)
        return res.send(`No streaming services found for ${countryCode}.`);
    }
    res.json(streamingServices)
});

// serviceRouter.patch("/:id", (req, res) => {
//     res.send("update one streaming service based on id")
// });

// serviceRouter.delete("/:id", (req, res) => {
//     res.send("delete one streaming service based on id")
// });



export default serviceRouter;