import { auth } from '@services/auth'

const basicAuthorizer = (event, _, cb) => {
  try {
    console.log(`LOG event`, event)

    if (!event.authorizationToken) {
      cb(`Authorization token missing`)
    }

    const [name, password] = auth.getCredentials(event.authorizationToken)
    console.log(`credentials`, [name, password])

    if (
      process.env.hasOwnProperty(name) &&
      process.env[name] &&
      process.env[name] === password
    ) {
      const policy = auth.generateAllow(name, event.methodArn)
      console.log(`policy`, policy)
      cb(null, policy)
    } else {
      const policy = auth.generateDeny(name, event.methodArn)
      console.log(`policy`, policy)
      cb(null, policy)
    }

  } catch (error) {
    console.log("LOG error in basicAuthorizer", error)
    cb(`Error in the authorizer`)
  }
}

export { basicAuthorizer }
