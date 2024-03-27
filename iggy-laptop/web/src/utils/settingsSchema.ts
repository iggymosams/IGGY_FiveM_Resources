import { Validator, type Schema } from "jsonschema";

const validator = new Validator();

const settingsSchema: Schema = {
    type: "object",
    properties: {
        wallpaper: { type: "string", required: true },
    },
};

export function isValid(data: string): boolean {
    const parsedData = JSON.parse(data);
    const response = validator.validate(parsedData, settingsSchema);
    console.log(response);
    return response.valid;
}
