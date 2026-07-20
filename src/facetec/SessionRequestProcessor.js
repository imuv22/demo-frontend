import { SampleAppNetworkingRequest } from "./SampleAppNetworkingRequest.js";

export class SessionRequestProcessor {
    constructor({
        externalDatabaseRefID = "",
        onFaceTecExit = () => { },
    } = {}) {
        this.externalDatabaseRefID =
            externalDatabaseRefID;

        this.handleFaceTecExit = onFaceTecExit;
    }

    onSessionRequest = (
        sessionRequestBlob,
        sessionRequestCallback
    ) => {
        SampleAppNetworkingRequest.send(
            this,
            sessionRequestBlob,
            sessionRequestCallback,
            this.externalDatabaseRefID
        );
    };

    onResponseBlobReceived = (
        responseBlob,
        sessionRequestCallback
    ) => {
        sessionRequestCallback.processResponse(
            responseBlob
        );
    };

    onUploadProgress = (
        progress,
        sessionRequestCallback
    ) => {
        sessionRequestCallback.updateProgress(progress);
    };

    onCatastrophicNetworkError = (
        sessionRequestCallback
    ) => {
        sessionRequestCallback.abortOnCatastrophicError();
    };

    onFaceTecExit = (faceTecSessionResult) => {
        this.handleFaceTecExit(faceTecSessionResult);
    };
}