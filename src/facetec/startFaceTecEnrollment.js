import { initializeFaceTec } from "./initializeFaceTec.js";

import { SessionRequestProcessor } from "./SessionRequestProcessor.js";

export async function startFaceTecEnrollment(
    externalDatabaseRefID
) {
    if (
        typeof externalDatabaseRefID !== "string" ||
        !externalDatabaseRefID.trim()
    ) {
        throw new Error(
            "externalDatabaseRefID is required."
        );
    }

    const faceTecSDKInstance =
        await initializeFaceTec();

    const FaceTecSDK = window.FaceTecSDK;

    return new Promise((resolve, reject) => {
        const sessionRequestProcessor =
            new SessionRequestProcessor({
                externalDatabaseRefID,

                onFaceTecExit(faceTecSessionResult) {
                    const completed =
                        faceTecSessionResult.status ===
                        FaceTecSDK.FaceTecSessionStatus
                            .SessionCompleted;

                    if (completed) {
                        resolve(faceTecSessionResult);
                        return;
                    }

                    reject(
                        new Error(
                            `FaceTec session ended with status: ${String(
                                faceTecSessionResult.status
                            )}`
                        )
                    );
                },
            });

        try {
            /*
             * When externalDatabaseRefID is included in the
             * request payload, FaceTec Testing API stores the
             * liveness-proven 3D FaceMap as an enrollment.
             */
            faceTecSDKInstance.start3DLiveness(
                sessionRequestProcessor
            );
        } catch (error) {
            reject(error);
        }
    });
}