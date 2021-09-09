import * as Multer from "multer";

import { AttachmentField } from "./attachment-field.class";

/**
 * Add files object to the Airtable fields object.
 */
export function addFilesToFields(files: Express.Request["files"], fields: any): any {
	if (files) {
		// if (Array.isArray(files)) {
		// 	const fieldName = files[0].fieldname;

		// 	const fieldValue = files.map(file => {
		// 		return new AttachmentField(file.originalname, file.filename);
		// 	});

		// 	fields = {...fields, [fieldName]: fieldValue };

		// } else {
			for (let file in files) {
				const fieldName = file;

				const fieldValue = files[fieldName].map(file => {
					return new AttachmentField(file.originalname, file.path);
				});

				fields = { ...fields, [fieldName]: fieldValue };
			}
		// }
	}

	return fields;
}

/**
 * Create a valid Multer fields object by parsing a fields configuration string.
 * @param fields Fields configuration string. E.g.: "photo,gallery:6,curriculum"
 */
export function createMulterFieldsFromString(fields: string[]): Multer.Field[] {
	if (fields) {
		return fields.map((field: string) => {

			// Parse field metadata
			if (field.includes(":")) {
				const [fieldName, fieldCount] = field.split(":");

				return {
					name: fieldName,
					maxCount: !isNaN(parseInt(fieldCount)) ? parseInt(fieldCount) : Infinity
				}
			} else {
				return {
					name: field
				}
			}
		});
	} else {
		return null;
	}
}

/**
 * Convert fields values into a primitive type.
 */
export function convertFieldsIntoPrimitives(fields) {
	Object.keys(fields).forEach((x) => {

		// Convert booleans
		if (globalThis.BOOLEAN_FIELDS.includes(x)) {
			fields[x] = fields[x] === "true";
		}

		// Convert numbers
		else if (globalThis.NUMBER_FIELDS.includes(x)) {
			fields[x] = Number(fields[x]);
		}
	});

	return fields;
}
