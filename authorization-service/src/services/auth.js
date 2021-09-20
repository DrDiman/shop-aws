const PoliceAction = {
  DENY: "deny",
  ALLOW: "allow",
}

class Auth {
  static getToken = (authorization) => authorization.split(" ")[1]

  static decodeB64ToString = (b64String) =>
    Buffer.from(b64String, "base64").toString("ascii")

  getCredentials = (basicAuthorizationToken) => {
    const token = Auth.getToken(basicAuthorizationToken)
    const credentials = Auth.decodeB64ToString(token)
    const [name, password] = credentials.split(":")
    return [name, password]
  }

  #generatePolicy = (principalId, Effect, Resource) => ({
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect,
          Resource,
        },
      ],
    },
  })

  generateAllow = (principalId, resource) =>
    this.#generatePolicy(principalId, PoliceAction.ALLOW, resource)

  generateDeny = (principalId = "user", resource) =>
    this.#generatePolicy(principalId, PoliceAction.DENY, resource)
}

const auth = new Auth()

export { auth }
