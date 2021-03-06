import * as path from "path";
import * as Express from "express";
import * as cors from "cors";
import * as Airtable from "airtable";
import * as useragent from "express-useragent";

import "./global";
import { addFilesToFields, convertFieldsIntoPrimitives } from "./helpers";
import multerObj from "./multer.config"

const airtableBase = new Airtable({ apiKey: globalThis.AIRTABLE_API_KEY }).base(globalThis.AIRTABLE_BASE_ID);

// Create express server
const app = Express();

// This will tell Express to determine the connection and the IP address of the client
// via X-Forwarded-* headers, usually needed when it's behind a front-facing proxy.
app.enable("trust proxy");

// Enable CORS for all requests
app.use("*", cors())

// Enable `useragent`
app.use(useragent.express())

// Start the express server
app.listen(globalThis.PORT, () => {
	console.log(`Server started at http://localhost:${globalThis.PORT}`);
});

// Endpoint for pinging health of the application
app.get("/.well-known/healthcheck.json", (req: Express.Request, res: Express.Response) => {
	const packageJson = require(path.join(__dirname, "../package.json"));

	res.send({
		ok: true,
		payload: {
			type: "HEALTHY",
			data: {
				date: new Date(),
				version: packageJson.version
			}
		}
	});
})

// Expose directory of files to allow Airtable to create attachments.
app.use("/files", Express.static(path.join(__dirname, "../files")));

// Form submission endpoint.
app.post("/submit", multerObj, (req: Express.Request, res: Express.Response) => {
	console.log("Request received.");

	console.log(`IP: ${req.ip}`);
	console.log(`User Agent: ${JSON.stringify(req.useragent)}`);

	// Set origin variable to later be used.
	globalThis.ORIGIN = `${req.protocol}://${req.get("host")}`;

	const body = req.body;
	console.debug(`Body: ${JSON.stringify(body)}`);

	const files = req.files;
	console.debug(`Files: ${JSON.stringify(files)}`);

	// Check if request has body to send to Airtable.
	if (body && Object.keys(body).length === 0) {
		console.log("Body doesn't have fields.");

		res.status(400).send({
			ok: false,
			payload: {
				type: "BODY_MUST_HAVE_FIELDS"
			}
		})

		return;
	}

	let fields = addFilesToFields(files, body);
	fields = convertFieldsIntoPrimitives(fields);

	console.debug("Going to send to AirTable:", fields);

	if (!globalThis.TEST) {
		airtableBase(globalThis.AIRTABLE_TABLE_NAME).create(fields, (error: any, record: any) => {
			if (error) {
				console.error("Couldn't create record. Error:", error);

				res.status(500).send({
					ok: false,
					payload: {
						type: "ERROR",
						data: error
					}
				});

				return;
			} else if (record) {
				console.log(`Created record with ID ${record.id} successfully!`);

				res.status(201).send({
					ok: true,
					payload: {
						type: "SUCCESSFULY_RECORDED_IN_AIRTABLE",
						data: {
							record_id: record.id
						}
					}
				});

				return;
			}
		});
	} else {
		res.send({
			ok: true,
			payload: {
				type: "TEST",
				data: true
			}
		});

		return;
	}
});
