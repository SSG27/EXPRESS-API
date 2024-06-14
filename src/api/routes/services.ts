import { Router } from "express";
import SService from "../models/ssModel";
import CCode from "../models/ccModel";
import mongoose from "mongoose";

const serviceRouter = Router();

// create new streaming service
serviceRouter.post("/newService", async (req, res) => {
    const { id, name, monthlyFee } = req.body;

    // Validation for missing fields
    if (!id && !name && !monthlyFee) {
        return res.status(400).json({ message: "All fields (id, name, monthly fee) are required." });
    }
    if (!id && !name) {
        return res.status(400).json({ message: "Both id and name are required." });
    }
    if (!id) {
        return res.status(400).json({ message: "id is required." });
    }
    if (!name) {
        return res.status(400).json({ message: "name is required." });
    }

    // Validation for ID (must be a single integer)
    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ message: "id must be a single integer with no spaces or other characters." });
    }

    // Validation for monthlyFee (must contain only numbers, dots, and currency symbols)
    if (monthlyFee && !/^[\d.,£$€¥₹]+$/.test(monthlyFee)) {
        return res.status(400).json({ message: "monthlyFee must only contain numbers, dots, and currency symbols." });
    }

    const service = new SService({
        id,
        name,
        monthlyFee,
    });

    try {
        const created = await service.save();
        res.status(201).json(created);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    console.log("created new streaming service with id: ", service.id, "name: ", service.name, "monthly fee: ", service.monthlyFee);
});

// get all streaming services
serviceRouter.get("/", async (req, res) => {
    try {
        const allServices = await SService.find({}, { _id: 0, __v: 0 });
        
        if (allServices.length === 0) {
            return res.status(404).send("No streaming services found.");
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
            return res.status(404).send(`Streaming service with id ${serviceId} not found.`);
        }

        res.json(service);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// get all streaming services with their monthly fee based on country code
serviceRouter.get("/code/:countryCode", async (req, res) => {
    try {
        const countryCode = req.params.countryCode;
        const countryCodeDocument = await CCode.findOne({ code: countryCode });

        if (!countryCodeDocument) {
            return res.status(404).send(`The country code ${countryCode} is not currently supported by our services.`);
        }

        const { services: serviceIds } = countryCodeDocument;
        const streamingServices = await SService.find({ id: { $in: serviceIds } }, { name: 1, monthlyFee: 1, _id: 0 });

        if (streamingServices.length === 0) {
            return res.status(400).send(`No streaming services found for ${countryCode}.`);
        }

        res.json(streamingServices);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// update one service based on id
serviceRouter.patch("/:id", async (req, res) => {
    try {
        const serviceId = req.params.id;
        const updates = req.body;

        if (!Object.keys(updates).length) {
            return res.status(400).json({ message: "At least one field to update is required." });
        }

        if (updates.id && !/^\d+$/.test(updates.id)) {
            return res.status(400).json({ message: "id must be a single integer with no spaces or other characters." });
        }

        if (updates.monthlyFee && !/^[\d.,£$€¥₹]+$/.test(updates.monthlyFee)) {
            return res.status(400).json({ message: "monthlyFee must only contain numbers, dots, and currency symbols." });
        }

        const updatedService = await SService.findOneAndUpdate(
            { id: serviceId },
            { $set: updates },
            { new: true, projection: { _id: 0, __v: 0 } }
        );

        if (!updatedService) {
            return res.status(404).send(`Streaming service with id ${serviceId} not found.`);
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
            return res.status(404).send(`Streaming service with id ${serviceId} not found.`);
        }

        res.json(deletedService);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

export default serviceRouter;
