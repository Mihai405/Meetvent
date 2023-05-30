import Messages from "../constants/messages";

export async function doRequest(path, requestObject) {
    const response = await fetch(path, requestObject);
    if (!response.ok) {
        throw new Error(Messages.networkErrorMessage);
    }
    return await response.json();
}
