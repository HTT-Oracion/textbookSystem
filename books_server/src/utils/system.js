import express from 'express'
import { secretKey } from '../settings/key.js'
export const getKey = () => {
    return secretKey
}
export const getRouter = () => express.Router()