import configJson from '../config.json'
import { merge } from 'ramda'

let config = configJson
try {
     const jsonEnv = require('../config-env.json')
     config = merge(configJson, jsonEnv)
} catch (err) {}

export const getConfig = () => config
