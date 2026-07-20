import { Config } from "./Config.js";
import { SessionRequestProcessor } from "./SessionRequestProcessor.js";

let faceTecSDKInstance = null;
let initializationPromise = null;

export function initializeFaceTec() {
    if (faceTecSDKInstance) {
        return Promise.resolve(faceTecSDKInstance);
    }

    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = new Promise(
        (resolve, reject) => {
            const FaceTecSDK = window.FaceTecSDK;

            if (!FaceTecSDK) {
                initializationPromise = null;

                reject(
                    new Error(
                        "FaceTecSDK is not loaded. Check the script in index.html."
                    )
                );

                return;
            }

            FaceTecSDK.setResourceDirectory(
                "/facetec/core-sdk/FaceTecSDK.js/resources"
            );

            FaceTecSDK.setImagesDirectory(
                "/facetec/core-sdk/FaceTec_images"
            );

            FaceTecSDK.initializeWithSessionRequest(
                Config.DeviceKeyIdentifier,
                new SessionRequestProcessor(),
                {
                    onSuccess(newFaceTecSDKInstance) {
                        faceTecSDKInstance =
                            newFaceTecSDKInstance;

                        console.log(
                            "FaceTec initialized successfully."
                        );

                        resolve(faceTecSDKInstance);
                    },

                    onError(initializationError) {
                        initializationPromise = null;

                        console.error(
                            "FaceTec initialization failed:",
                            initializationError
                        );

                        reject(
                            new Error(
                                `FaceTec initialization failed: ${String(
                                    initializationError
                                )}`
                            )
                        );
                    },
                }
            );
        }
    );

    return initializationPromise;
}

export function getFaceTecSDKInstance() {
    return faceTecSDKInstance;
}