import { createClient } from 'redis'
import { expiresIn } from '#src/settings/system';
let client = createClient()
export default (async() => {
    console.log('redis');
    client.on('error', err => console.log('Redis Client Error', err));
    await client.connect()
})()

export const getRedisValue = async (key, value) => {
    return await client.get(key)
}

export const existRedisKey = async (key) => {
    return await client.exists(key)
}

export const setRedisValue = async(key, value) => {
    const result = await client.set(key, value)
    await client.expire(key, expiresIn)
    return result 
}

export const closeRedisClient = async() => {
    await client.quit()
    client = null 
}

