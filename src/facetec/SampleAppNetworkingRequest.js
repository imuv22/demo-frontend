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

            // Required only while using FaceTec Testing API.
            request.setRequestHeader(
                "X-Device-Key",
                Config.DeviceKeyIdentifier
            );

            request.setRequestHeader(
                "X-Testing-API-Header",
                window.FaceTecSDK.getTestingAPIHeader()
            );

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
            console.error(
                `FaceTec server returned HTTP ${request.status}:`,
                request.responseText
            );

            return null;
        }

        try {
            const parsedResponse = JSON.parse(
                request.responseText
            );

            if (
                typeof parsedResponse.responseBlob !== "string" ||
                !parsedResponse.responseBlob
            ) {
                console.error(
                    "FaceTec response did not contain a responseBlob:",
                    parsedResponse
                );

                return null;
            }

            return parsedResponse.responseBlob;
        } catch (error) {
            console.error(
                "Could not parse FaceTec response:",
                error
            );

            return null;
        }
    }
}