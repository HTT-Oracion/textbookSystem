import { createClient } from 'redis'

let client = createClient()
export default (async() => {
    console.log('redis');
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect()
})()

export const getRedisValue = async (key, value) => {
    return await client.get(key)
}

export const setRedisValue = async(key, value) => {
    return await client.set(key, value)
}

export const closeRedisClient = async() => {
    await client.quit()
    client = null 
}

