import { Config } from "./Config.js";

export class SampleAppNetworkingRequest {
    static MAX_ERRORS_ALLOWED = 4;

    static getSessionRequestRetryDelay(errorCount) {
        if (errorCount === 1) return 0;
        if (errorCount === 2) return 2000;
        if (errorCount === 3) return 5000;
        if (errorCount === 4) return 10000;

        return 0;
    }

    static send(
        referencingProcessor,
        sessionRequestBlob,
        sessionRequestCallback,
        externalDatabaseRefID = ""
    ) {
        const sessionRequestCallPayload = {
            requestBlob: sessionRequestBlob,
            testingApiHeader:
                window.FaceTecSDK.getTestingAPIHeader(),
        };

        if (externalDatabaseRefID) {
            sessionRequestCallPayload.externalDatabaseRefID =
                externalDatabaseRefID;
        }

        let errorCount = 0;

        const openAndSendRequest = () => {
            const request = new XMLHttpRequest();

            request.timeout = 2 * 60 * 1000;

            request.open(
                "POST",
                Config.YOUR_API_OR_FACETEC_TESTING_API_ENDPOINT
            );

            request.setRequestHeader(
                "Content-Type",
                "application/json"
            );

            request.withCredentials = true;

            const token = localStorage.getItem("token");

            if (token) {
                request.setRequestHeader(
                    "Authorization",
                    `Bearer ${token}`
                );
            }

            request.onload = () => {
                const responseBlob =
                    SampleAppNetworkingRequest.getResponseBlobOrHandleError(
                        request
                    );

                if (responseBlob) {
                    referencingProcessor.onResponseBlobReceived(
                        responseBlob,
                        sessionRequestCallback
                    );

                    return;
                }

                referencingProcessor.onCatastrophicNetworkError(
                    sessionRequestCallback
                );
            };

            request.onerror = (event) => {
                if (
                    errorCount <
                    SampleAppNetworkingRequest.MAX_ERRORS_ALLOWED
                ) {
                    errorCount += 1;

                    setTimeout(
                        openAndSendRequest,
                        SampleAppNetworkingRequest.getSessionRequestRetryDelay(
                            errorCount
                        )
                    );

                    return;
                }

                console.error(
                    "FaceTec catastrophic network error:",
                    event
                );

                referencingProcessor.onCatastrophicNetworkError(
                    sessionRequestCallback
                );
            };

            request.ontimeout = () => {
                console.error("FaceTec request timed out.");

                referencingProcessor.onCatastrophicNetworkError(
                    sessionRequestCallback
                );
            };

            request.upload.onprogress = (event) => {
                if (event.lengthComputable && event.total > 0) {
                    referencingProcessor.onUploadProgress(
                        event.loaded / event.total,
                        sessionRequestCallback
                    );
                }
            };

            request.send(
                JSON.stringify(sessionRequestCallPayload)
            );
        };

        openAndSendRequest();
    }

    static getResponseBlobOrHandleError(request) {
        if (request.status !== 200) {
            const parsedErrorResponse = parseResponseJson(
                request.responseText
            );

            console.error(
                `FaceTec server returned HTTP ${request.status}:`,
                parsedErrorResponse?.message || "Request failed"
            );

            return null;
        }

        const parsedResponse = parseResponseJson(
            request.responseText
        );

        if (!parsedResponse) {
            console.error(
                "Could not parse FaceTec response."
            );

            return null;
        }

        const responseBlob =
            parsedResponse.responseBlob ||
            parsedResponse.data?.responseBlob;

        if (
            typeof responseBlob !== "string" ||
            !responseBlob
        ) {
            console.error(
                "FaceTec response did not contain a responseBlob."
            );

            return null;
        }

        return responseBlob;
    }
}

function parseResponseJson(responseText) {
    try {
        return JSON.parse(responseText);
    } catch {
        return null;
    }
}
