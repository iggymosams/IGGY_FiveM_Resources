import Ajv from "ajv";

const ajv = new Ajv();

const settingsSchema = {
    type: "object",
    properties: {
        wallpaper: { type: "string" },
    },
    required: ["wallpaper"],
};

export function isValid(data: string): boolean {
    const parsedData = JSON.parse(data);

    const validate = ajv.compile(settingsSchema);
    const valid = validate(parsedData);

    return valid;
}
