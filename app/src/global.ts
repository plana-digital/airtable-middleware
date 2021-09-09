globalThis.PORT = parseInt(process.env.PORT) || 8080;
globalThis.TEST = !!process.env.TEST;
globalThis.AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
globalThis.AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
globalThis.AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
globalThis.BOOLEAN_FIELDS = process.env.BOOLEAN_FIELDS?.split(",");
globalThis.NUMBER_FIELDS = process.env.NUMBER_FIELDS?.split(",");
globalThis.ATTACHMENT_FIELDS = process.env.ATTACHMENT_FIELDS?.split(",");
