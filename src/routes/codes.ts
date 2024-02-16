import { Router } from "express";
import CCode from "../models/ccModel";

const codesRouter = Router();

// create a country collection
codesRouter.post("/", async (req, res) => {
    try {
        const { code, country, services } = req.body;
        const countryCode = new CCode({ code, country, services });
        const createdCode = await countryCode.save();
        res.status(201).json(createdCode);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// return all countries supported
codesRouter.get("/", async (req, res) => {
    try {
        const allCountryCodes = await CCode.find({}, { _id: 0, __v: 0 });
        res.json(allCountryCodes);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// get one country by code
codesRouter.get("/:code", async (req, res) => {
    try {
        const code = req.params.code;
        const country = await CCode.findOne({ code }, { _id: 0, __v: 0 });

        if (!country) {
            res.status(404);
            return res.send(`Country code ${code} not found.`);
        }

        res.json(country);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// update one country by code
codesRouter.patch("/:code", async (req, res) => {
    try {
        const code = req.params.code;
        const updates = req.body;

        if (!Object.keys(updates).length) {
            res.status(400);
            return res.json({ message: "At least one field to update is required." });
        }

        const updatedCountry = await CCode.findOneAndUpdate(
            { code },
            { $set: updates },
            { new: true, projection: { _id: 0, __v: 0 } }
        );

        if (!updatedCountry) {
            res.status(404);
            return res.send(`Country code ${code} not found.`);
        }

        res.json(updatedCountry);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// delete one country by code
codesRouter.delete("/:code", async (req, res) => {
    try {
        const code = req.params.code;
        const deletedCountry = await CCode.findOneAndDelete({ code }, { projection: { _id: 0, __v: 0 } });

        if (!deletedCountry) {
            res.status(404);
            return res.send(`Country code ${code} not found.`);
        }

        res.json(deletedCountry);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

export default codesRouter;
