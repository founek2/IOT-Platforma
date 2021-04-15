import * as validations from '../validations';
import { stateValid, stateInvalidPassword, stateEmptyUserName } from './resources/state';

describe('Validations test', function () {
    it('should create new fieldState - invalid', function () {
        expect(validations
            .createFieldState(['required', 'notString'])
        ).toStrictEqual({ valid: false, errorMessages: ['required', 'notString'] });

    });

    it('should create new fieldState - valid', function () {
        expect(validations.createFieldState([])).toStrictEqual({ valid: true, errorMessages: [] });

    });

    it('should check fieldState - valid', function () {
        expect(validations
            .checkValid({
                REGISTRATION: {
                    info: {
                        userName: { valid: true, errorMessages: [] }
                    },
                    auth: {
                        type: { valid: true, errorMessages: [] }
                    }
                }
            }))
            .toStrictEqual({
                valid: true,
                errors: []
            });
    });

    it('should check fieldState - invalid', function () {
        expect(validations
            .checkValid({
                REGISTRATION: {
                    info: {
                        userName: { valid: false, errorMessages: ['required'] }
                    }
                }
            }))
            .toStrictEqual({
                valid: false,
                errors: [
                    {
                        deepPath: 'REGISTRATION.info.userName',
                        errorMessages: ['required']
                    }
                ]
            });
    });

    it('should validate field - valid', function () {
        expect(validations
            .validateField('REGISTRATION.info.userName', stateEmptyUserName, true, true)
        ).toStrictEqual({ valid: true, errorMessages: [] });
    });

    it('should validate field - invalid', function () {
        expect(validations
            .validateField('REGISTRATION.info.userName', stateEmptyUserName)
        ).toStrictEqual({ valid: false, errorMessages: ['isRequired'] });
    });

    it('should validate form - valid', function () {
        expect(validations
            .checkValid(validations.validateForm('REGISTRATION', stateValid))
        ).toStrictEqual({ valid: true, errors: [] });
    });

    it('should validate form - invalid', function () {
        expect(validations.checkValid(validations.validateRegisteredFields('REGISTRATION', stateInvalidPassword))).toStrictEqual({
            valid: false,
            errors: [
                {
                    deepPath: 'REGISTRATION.auth.password',
                    errorMessages: ['Text nesmí být kratší než 4']
                }
            ]
        });
    });
});
