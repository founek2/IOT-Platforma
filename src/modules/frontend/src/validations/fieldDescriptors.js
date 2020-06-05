import validationFactory from 'framework-ui/src/validations/validationFactory'
import { AuthTypes, ControlTypes, SampleIntervals, RgbTypes, LINEAR_TYPE } from '../constants'
import { assocPath, is, forEachObjIndexed } from 'ramda'
import setInPath from 'framework-ui/src/utils/setInPath'

function recursive(transform, predicate, object) {
     const func = (accum = '') => (value, key) => {
          if (predicate(value)) return rec(value, accum + key + ".")
          transform(value, accum + key)
     }

     function rec(obj, accum) {
          forEachObjIndexed(func(accum), obj)
     }
     rec(object)
}

function transformToForm(formName, fields) {           // TODO doesnt work for nested fields
     let result = {};
     recursive((val, deepPath) => {
          const newVal = { ...val, deepPath: val.deepPath.replace(/[^.]*/, formName) }
          result = setInPath(deepPath, newVal, result)
     }, (val) => is(Object, val) && !val.deepPath, fields)

     return result;
}

const LOGIN = {
     userName: {
          deepPath: 'LOGIN.userName',
          required: true,
          label: 'Uživatelské jméno',
          name: "username",
          validations: [validationFactory('isString', { min: 4, max: 30 })]
     },
     password: {
          deepPath: 'LOGIN.password',
          required: true,
          when: ({ authType }) => authType === AuthTypes.PASSWD,
          label: 'Heslo',
          name: "password",
          validations: [validationFactory('isString', { min: 4, max: 20 })]
     },
     authType: {
          deepPath: 'LOGIN.authType',
          required: true,
          label: 'Pokročilá autentizace',
          name: "authtype",
          validations: [validationFactory('isString', { min: 4, max: 20 })]
     }
}
const userFields = {
     info: {
          userName: {
               deepPath: 'REGISTRATION.info.userName',
               required: true,
               label: 'Uživatelské jméno',
               name: "username",
               validations: [validationFactory('isString', { min: 4, max: 30 })]
          },
          firstName: {
               deepPath: 'REGISTRATION.info.firstName',
               required: true,
               label: 'Jméno',
               name: "firstname",
               validations: [validationFactory('isString', { min: 2, max: 20 })]
          },
          lastName: {
               deepPath: 'REGISTRATION.info.lastName',
               required: true,
               label: 'Příjmení',
               name: "lastname",
               validations: [validationFactory('isString', { min: 2, max: 20 })]
          },
          email: {
               deepPath: 'REGISTRATION.info.email',
               label: 'Email',
               name: "email",
               validations: [validationFactory('isEmail')]
          },
          phoneNumber: {
               deepPath: 'REGISTRATION.info.phoneNumber',
               label: 'Telefonní číslo',
               name: "phonenumber",
               validations: [validationFactory('isPhoneNumber')]
          },
     },
     auth: {
          type: {
               deepPath: 'REGISTRATION.auth.type',
               // required: true,
               label: 'Pokročilá autentizace',
               name: "authtype",
               validations: [validationFactory('isString', { min: 4, max: 20 })]
          },
     }
}

const passwd = {
     deepPath: 'REGISTRATION.auth.password',
     required: true,
     label: 'Heslo',
     name: "password",
     validations: [validationFactory('isString', { min: 4, max: 20 })]
};

const REGISTRATION = assocPath(["auth", 'password'], passwd, userFields)

const passwdNotReq = {
     deepPath: 'EDIT_USER.auth.password',
     // required: true,
     label: 'Heslo',
     validations: [validationFactory('isString', { min: 4, max: 20 })]
}

const EDIT_USER = assocPath(["auth", "password"], passwdNotReq, {
     ...transformToForm('EDIT_USER', userFields),
     groups: {
          deepPath: 'EDIT_USER.groups',
          label: 'Uživatelské skupiny',
          required: true,
          validations: [validationFactory('isNotEmptyArray')]
     },
})

const CREATE_DEVICE = {
     info: {
          title: {
               deepPath: 'CREATE_DEVICE.info.title',
               required: true,
               label: 'Název',
               name: "title",
               validations: [validationFactory('isString', { min: 4, max: 20 })]
          },
          description: {
               deepPath: 'CREATE_DEVICE.info.description',
               label: 'Popis',
               name: "description",
               validations: [validationFactory('isString', { min: 2, max: 200 })]
          },
          image: {
               deepPath: 'CREATE_DEVICE.info.image',
               required: true,
               label: 'Obrázek',
               name: "image",
               validations: [validationFactory('isFile')]
          },
     },
     gps: {
          "coordinates[]": {
               deepPath: 'CREATE_DEVICE.gps.coordinates[]',
               required: true,
               validations: [validationFactory('isNumber')]
          },
     },
     topic: {
          deepPath: 'CREATE_DEVICE.topic',
          required: true,
          label: 'Topic',
          name: "topic",
          validations: [validationFactory('isString', { min: 2, max: 100, startsWith: "/", pattern: /^(\/[a-zA-Z\d]+){3}$/ })]
     },
     publicRead: {
          deepPath: 'CREATE_DEVICE.publicRead',
          label: 'Veřejné zařízení',
          name: "public",
          validations: [validationFactory('isBool')]
     },
}

const EDIT_DEVICE = {
     info: {
          title: {
               deepPath: 'EDIT_DEVICE.info.title',
               required: true,
               label: 'Název',
               name: "title",
               validations: [validationFactory('isString', { min: 4, max: 20 })]
          },
          description: {
               deepPath: 'EDIT_DEVICE.info.description',
               label: 'Popis',
               name: "description",
               validations: [validationFactory('isString', { min: 2, max: 200 })]
          },
          image: {
               deepPath: 'EDIT_DEVICE.info.image',
               label: 'Obrázek',
               name: "image",
               validations: [validationFactory('isFile')]
          },
     },
     publicRead: {
          deepPath: 'EDIT_DEVICE.publicRead',
          label: 'Veřejné zařízení',
          name: "public",
          validations: [validationFactory('isBool')]
     },
     gps: {
          "coordinates[]": {
               deepPath: 'EDIT_DEVICE.gps.coordinates[]',
               required: true,
               validations: [validationFactory('isNumber')]
          },
     },
     topic: {
          deepPath: 'EDIT_DEVICE.topic',
          required: true,
          label: 'Topic',
          name: "topic",
          validations: [validationFactory('isString', { min: 2, max: 100, startsWith: "/", pattern: /\/.+\/.+\/.+/ })]
     },
}

const EDIT_SENSORS = {
     sampleInterval: {
          deepPath: 'EDIT_SENSORS.sampleInterval',
          required: true,
          label: 'Interval samplování',
          name: "sampleinterval",
          validations: [validationFactory('isOneOf', { values: SampleIntervals })]
     },

     'name[]': {
          deepPath: 'EDIT_SENSORS.name[]',
          label: 'Název',
          required: true,
          validations: [validationFactory('isString', { min: 2, max: 30 })]
     },
     'unit[]': {
          deepPath: 'EDIT_SENSORS.unit[]',
          label: 'Jednotka',
          required: true,
          validations: [validationFactory('isString', { min: 1, max: 6 })]
     },
     'JSONkey[]': {
          deepPath: 'EDIT_SENSORS.JSONkey[]',
          label: 'Označení',
          required: true,
          validations: [validationFactory('isString', { min: 1, max: 20 })]
     },
     "description[]": {
          deepPath: 'EDIT_SENSORS.description[]',
          defaultValue: "",
          label: 'Popis',
          validations: [validationFactory('isString', { min: 1, max: 200 })]
     },
     "count": {
          deepPath: 'EDIT_SENSORS.count',
          label: 'Popis',
          name: "count",
          validations: [validationFactory('isNumber')]
     }
}

const EDIT_CONTROL = {
     'name[]': {
          deepPath: 'EDIT_SENSORS.name[]',
          label: 'Název',
          required: true,
          validations: [validationFactory('isString', { min: 2, max: 30 })]
     },
     'type[]': {
          deepPath: 'EDIT_SENSORS.type[]',
          label: 'Typ',
          required: true,
          validations: [validationFactory('isOneOf', { values: ControlTypes })]
     },
     'JSONkey[]': {
          deepPath: 'EDIT_SENSORS.JSONkey[]',
          label: 'Klíč',
          required: true,
          validations: [validationFactory('isString', { min: 1, max: 20 })]
     },
     "description[]": {
          deepPath: 'EDIT_SENSORS.description[]',
          defaultValue: "",
          label: 'Popis',
          validations: [validationFactory('isString', { min: 1, max: 200 })]
     },
     "count": {
          deepPath: 'EDIT_SENSORS.count',
          label: 'Popis',
          name: "count",
          validations: [validationFactory('isNumber')]
     }
}

const EDIT_NOTIFY_SENSORS = {
     'JSONkey[]': {
          deepPath: 'EDIT_NOTIFY_SENSORS.JSONkey[]',
          label: 'Veličina',
          required: true,
          validations: [validationFactory('isString', { min: 1, max: 20 })]
     },
     'type[]': {
          deepPath: 'EDIT_NOTIFY_SENSORS.type[]',
          label: 'Akce',
          required: true,
          validations: [validationFactory('isString', { min: 1, max: 6 })]
     },
     "value[]": {
          deepPath: 'EDIT_NOTIFY_SENSORS.value[]',
          label: 'Mezní hodnota',
          required: true,
          when: ({ type }, { i }) => !type || type[i] !== "change",  // needs constant
          validations: [validationFactory('isNumber')]
     },
     "interval[]": {
          deepPath: 'EDIT_NOTIFY_SENSORS.interval[]',
          label: 'Interval',
          required: true,
          validations: [validationFactory('isNumber')]
     },
     "description[]": {
          deepPath: 'EDIT_NOTIFY_SENSORS.description[]',
          defaultValue: "",
          label: 'Popis',
          validations: [validationFactory('isString', { min: 1, max: 200 })]
     },
     "count": {
          deepPath: 'EDIT_NOTIFY_SENSORS.count',
          name: "count",
          required: true,
          validations: [validationFactory('isNumber')]
     }
}


const EDIT_RGB = {
     "type": {
          deepPath: 'EDIT_RGB.type',
          label: 'Typ',
          // required: true,
          validations: [validationFactory('isOneOf', { values: RgbTypes })]
     },
     "color": {
          deepPath: 'EDIT_RGB.color',
          label: 'Barva',
          required: true,
          when: ({ type }) => type === LINEAR_TYPE,
          validations: [validationFactory('isColor')]
     },
     "bright": {
          deepPath: 'EDIT_RGB.bright',
          label: 'Jas',
          // required: true,
          validations: [validationFactory('isNumber', { min: 0, max: 100 })]
     },
     "on": {
          deepPath: 'EDIT_RGB.on',
          label: 'Zapnuto',
          // required: true,
          validations: [validationFactory('isNumber', { min: 0, max: 1 })]
     },
}

const CHANGE_DEVICE_STATE_RGB = {
     JSONkey: {
          deepPath: 'CHANGE_DEVICE_STATE_RGB.JSONkey',
          required: true
     },
     state: {
          "type": {
               deepPath: 'CHANGE_DEVICE_STATE_RGB.state.type',
               label: 'Typ',
               validations: [validationFactory('isOneOf', { values: RgbTypes })]
          },
          "color": {
               deepPath: 'CHANGE_DEVICE_STATE_RGB.state.color',
               label: 'Barva',
               when: ({ type }) => type === LINEAR_TYPE,
               required: true,
               validations: [validationFactory('isColor')]
          },
          "bright": {
               deepPath: 'CHANGE_DEVICE_STATE_RGB.state.bright',
               label: 'Jas',
               validations: [validationFactory('isNumber', { min: 0, max: 100 })]
          },
          "on": {
               deepPath: 'CHANGE_DEVICE_STATE_RGB.state.on',
               label: 'Zapnuto',
               validations: [validationFactory('isNumber', { min: 0, max: 1 })]
          },
     }
}

const CHANGE_DEVICE_STATE_SWITCH = {
     JSONkey: {
          deepPath: 'CHANGE_DEVICE_STATE_SWITCH.JSONkey',
          required: true
     },
     state: {
          "on": {
               deepPath: 'CHANGE_DEVICE_STATE_SWITCH.state.on',
               label: 'Zapnuto',
               required: true,
               validations: [validationFactory('isNumber', { min: 0, max: 1 })]
          }
     }
}

const USER_MANAGEMENT = {
     selected: {
          deepPath: 'USER_MANAGEMENT.selected',
          required: true,
          validations: [validationFactory('isNotEmptyArray')]
     }
}

const EDIT_PERMISSIONS = {
     read: {
          deepPath: 'EDIT_PERMISSIONS.read',
          label: "Čtení"
     },
     write: {
          deepPath: 'EDIT_PERMISSIONS.write',
          required: true,
          label: "Editace"
     },
     control: {
          deepPath: 'EDIT_PERMISSIONS.control',
          label: "Ovládání"
     }
}

export default {
     LOGIN,
     REGISTRATION,
     USER_MANAGEMENT,
     EDIT_USER,
     CREATE_DEVICE,
     EDIT_DEVICE,
     EDIT_SENSORS,
     EDIT_PERMISSIONS,
     EDIT_CONTROL,
     EDIT_RGB,
     CHANGE_DEVICE_STATE_RGB,
     CHANGE_DEVICE_STATE_SWITCH,
     EDIT_NOTIFY_SENSORS,
}
