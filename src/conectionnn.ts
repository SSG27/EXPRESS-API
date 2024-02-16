import mongoose from "mongoose";
import CCode from "./models/ccModel";
import SService from "./models/ssModel";


const DB_URI = "mongodb://localhost:27017/country-code"

async function createNewStreamingService(id: string, name: string, monthlyFee: string) {
    const newService = new SService({
      id,
      name,
      monthlyFee,
    });
  
    await newService.save();
    console.log(`New streaming service added: ${name}`);
  }

async function getStreamingInfoByCountryName(countryName: string) {
    const countryCodeDocument = await CCode.findOne({ country: countryName });
  
    if (!countryCodeDocument) {
      console.log(`The country ${countryName} is not currently supported by our services. Try moving to a more relevant country and try again`);
      return;
    }
  
    const { code, services: serviceIds } = countryCodeDocument;
  
    const streamingServices = await SService.find({ id: { $in: serviceIds } });
  
    if (streamingServices.length === 0) {
      console.log(`No streaming services found for ${countryName}.`);
      return;
    }
  
    console.log(`Country Code for ${countryName}: ${code}`);
    console.log("Streaming Services and Prices:");
    streamingServices.forEach((service) => {
      console.log(`${service.name} - ${service.monthlyFee}`);
    });
  }

  async function updateCountryCode(countryName: string, newCode: string, newServices: number[]) {
    const updateResult = await CCode.updateOne(
      { country: countryName },
      {
        $set: {
          code: newCode,
          services: newServices,
        },
      }
    );
  
    if (updateResult.modifiedCount === 1) {
      console.log(`Country code for ${countryName} updated successfully.`);
    } else {
      console.log(`Country code for ${countryName} not found or no changes made.`);
    }
  }

  async function deleteStreamingService(serviceId: string) {
    const deleteResult = await SService.deleteOne({ id: serviceId });
  
    if (deleteResult.deletedCount === 1) {
      console.log(`Streaming service with ID ${serviceId} deleted successfully.`);
    } else {
      console.log(`Streaming service with ID ${serviceId} not found or no changes made.`);
    }
  }

async function main() {
    await mongoose.connect(DB_URI)

    const codes = await CCode.find()
    const services = await SService.find()

    // await getStreamingInfoByCountryName('United Arab Emirates');

    // await createNewStreamingService('14', 'fuckckckkcck', '£6.90');

    // await updateCountryCode('United Arab Emirates', 'ae', [1, 3, 5, 9, 10, 13, 14]);

    // await deleteStreamingService('14');

}

main().catch(e => console.error(e))