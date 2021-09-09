export class AttachmentField {
	public filename: string;
	public url: string;

	constructor(filename: string, filePath: string) {
		this.filename = filename;
		this.url = `${globalThis.ORIGIN}/${filePath}`;
	}
}
