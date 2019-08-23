import cmd from 'node-cmd'
import Promise from 'bluebird'

const getAsync = Promise.promisify(cmd.get, { multiArgs: true, context: cmd })

export async function addUser(userName, password) {
    return getAsync(
        `rabbitmqctl add_user ${userName} ${password}`
    ).then(data => {
        return null
    }).catch(err => {
        console.log(err.cause)

        return 'userAlreadyExist'
    })
}

export async function setPermissions(userName, permissions) {
    return getAsync(
        `rabbitmqctl set_permissions -p / ${userName} ${permissions}`
    ).then(data => {
        console.log("data",data)
        return null
    }).catch(err => {
        console.log(err.cause)

        return 'cannotSetPermissions'
    })
}

export async function setTopicPermissions(userName) {
    return getAsync(
        `rabbitmqctl set_topic_permissions -p / ${userName} amq.topic "^\.${userName}\..+" "^\.${userName}\..+"`
    ).then(data => {
        console.log("data",data)
        return null
    }).catch(err => {
        console.log(err.cause)

        return 'cannotSetPermissions'
    })
}