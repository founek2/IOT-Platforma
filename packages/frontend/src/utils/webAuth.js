// sample arguments for registration
const createCredentialDefaultArgs = ({id, challenge}, firstName, lastName) => ({
    publicKey: {
        /**
         * rp: This stands for “relying party”; it can be considered as describing the organization responsible for registering and authenticating the user. The id must be a subset of the domain currently in the browser. For example, a valid id for this page is webauthn.guide
         */
        rp: {
            name: "IOTPlatforma",
            id: "localhost",
        },
        user: {
            id: Uint8Array.from(
                id, c => c.charCodeAt(0)),
            name: firstName + " " + lastName || "John Doe",
            displayName: firstName || "John",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            // authenticatorAttachment: "cross-platform",
             userVerification: "preferred"
        },
        timeout: 60000,
        attestation: "direct",

        challenge: Buffer.from(challenge.data).buffer
    }
});

export function create(object, name) {
    return navigator.credentials.create(createCredentialDefaultArgs(object))
}