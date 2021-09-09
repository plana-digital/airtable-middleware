PORT = parseInt(process.env.PORT) || 8080;
TEST = !!process.env.TEST;
AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
BOOLEAN_FIELDS = process.env.BOOLEAN_FIELDS?.split(",");
NUMBER_FIELDS = process.env.NUMBER_FIELDS?.split(",");
ATTACHMENT_FIELDS = process.env.ATTACHMENT_FIELDS?.split(",");
