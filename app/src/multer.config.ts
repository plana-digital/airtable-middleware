import * as Multer from "multer";
import { nanoid } from "nanoid";
import * as mime from "mime-types";

import { createMulterFieldsFromString } from "./helpers";

const fileFields: Multer.Field[] = createMulterFieldsFromString(globalThis.ATTACHMENT_FIELDS);

const storage = Multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./files");
	},
	filename: (req, file, cb) => {
		// Generate a unique name (to avoid collisions)
		const id = nanoid();

		// Get proper extension by evaluating mime type, as some files may not have an extension
		const ext = mime.extension(file.mimetype);

		cb(null, `${id}.${ext}`)
	}
});

export default fileFields ? Multer({ storage }).fields(fileFields) : Multer().none();
