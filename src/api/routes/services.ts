import {Router} from "express";
import SService from "../models/ssModel";
import CCode from "../models/ccModel";

const serviceRouter = Router();

// create new streaming service

// body params:
// {
//     "id": "20",
//     "name": "foxNews",
//     "monthlyFee": "£0.00"
// }

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
    console.log("created new streaming service with id: ", service.id, "name: ", service.name, "monthly fee: ", service.monthlyFee)
});

// get all streaming services
serviceRouter.get("/", async (req, res) => {
    try {
        const allServices = await SService.find({}, { _id: 0,  __v: 0});
        
        if (allServices.length === 0) {
            res.status(404);
            return res.send("No streaming services found.");
        }

        res.json(allServices);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// get one streaming service based on its id
serviceRouter.get("/:id", async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await SService.findOne({ id: serviceId }, { _id: 0, __v: 0 });

        if (!service) {
            res.status(404);
            return res.send(`Streaming service with id ${serviceId} not found.`);
        }

        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// get all streaming services with their monthly fee based on country code
// http://localhost:3000/services/code/ae
serviceRouter.get("/code/:countryCode", async (req, res) => {
    try {
        const countryCode = req.params.countryCode;
        const countryCodeDocument = await CCode.findOne({ code: countryCode });

        if (!countryCodeDocument) {
            res.status(404);
            return res.send(`The country code ${countryCode} is not currently supported by our services.`);
        }
    
        const { services: serviceIds } = countryCodeDocument;
        const streamingServices = await SService.find({ id: { $in: serviceIds } }, { name: 1, monthlyFee: 1, _id: 0 });
    
        if (streamingServices.length === 0) {
            res.status(400);
            return res.send(`No streaming services found for ${countryCode}.`);
        }

        res.json(streamingServices);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// update one service based on id

// body params:
// {
//     "monthlyFee": "$9.99"
// }

serviceRouter.patch("/:id", async (req, res) => {
    try {
        const serviceId = req.params.id;
        const updates = req.body;

        // Validate that at least one field to update is provided
        if (!Object.keys(updates).length) {
            res.status(400);
            return res.json({ message: "At least one field to update is required." });
        }

        const updatedService = await SService.findOneAndUpdate(
            { id: serviceId },
            { $set: updates },
            { new: true, projection: { _id: 0, __v: 0 } }
        );

        if (!updatedService) {
            res.status(404);
            return res.send(`Streaming service with id ${serviceId} not found.`);
        }

        res.json(updatedService);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// delete service based on id
serviceRouter.delete("/:id", async (req, res) => {
    try {
        const serviceId = req.params.id;
        const deletedService = await SService.findOneAndDelete({ id: serviceId }, { projection: { _id: 0, __v: 0 } });

        if (!deletedService) {
            res.status(404);
            return res.send(`Streaming service with id ${serviceId} not found.`);
        }

        res.json(deletedService);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

export default serviceRouter;