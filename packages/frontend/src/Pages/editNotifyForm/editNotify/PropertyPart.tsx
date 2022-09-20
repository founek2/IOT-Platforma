import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { NotfyTypeForDataType, NotifyType, NotifyTypeText } from 'common/src/models/interface/notifyInterface';
import { IThing, IThingProperty, IThingPropertyEnum, PropertyDataType } from 'common/src/models/interface/thing';
import { isNumericDataType } from 'common/src/utils/isNumericDataType';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import { formsDataActions } from 'framework-ui/src/redux/actions/formsData';
import { getFieldVal } from 'framework-ui/src/utils/getters';
import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'src/hooks';

interface PropertyPartProps {
    id: number;
    config: IThing['config'];
    selectedProperty?: IThingProperty;
    selectedType?: NotifyType;
}

function PropertyPart({ id, config }: PropertyPartProps) {
    const selectedPropId = useAppSelector<string | undefined>(getFieldVal(`EDIT_NOTIFY.propertyId.${id}`));
    const selectedProperty: IThingProperty | undefined = selectedPropId
        ? config.properties.find(({ propertyId }) => propertyId === selectedPropId)
        : undefined;
    const isEnum = selectedProperty ? selectedProperty.dataType === PropertyDataType.enum : false;
    const isNumerical = selectedProperty ? isNumericDataType(selectedProperty.dataType) : false;
    const dispatch = useDispatch();
    const selectedType = useAppSelector<NotifyType | undefined>(getFieldVal(`EDIT_NOTIFY.type.${id}`));

    function updateFormField(deepPath: string, value: any) {
        dispatch(formsDataActions.setFormField({ deepPath, value }));
    }

    return (
        <Fragment>
            <Grid item md={4} xs={12}>
                <FieldConnector
                    component="Select"
                    deepPath={`EDIT_NOTIFY.propertyId.${id}`}
                    fieldProps={{
                        fullWidth: true,
                    }}
                    selectOptions={config.properties.map(({ name, propertyId }) => (
                        <MenuItem value={propertyId} key={propertyId}>
                            {name}
                        </MenuItem>
                    ))}
                    onChange={() => {
                        updateFormField(`EDIT_NOTIFY.type.${id}`, '');
                        updateFormField(`EDIT_NOTIFY.value.${id}`, '');
                    }}
                />
            </Grid>
            {selectedProperty ? (
                <Fragment>
                    <Grid item md={4} xs={12}>
                        <FieldConnector
                            component="Select"
                            deepPath={`EDIT_NOTIFY.type.${id}`}
                            fieldProps={{
                                fullWidth: true,
                            }}
                            onChange={() => {
                                updateFormField(`EDIT_NOTIFY.value.${id}`, '');
                            }}
                            selectOptions={Object.values(NotfyTypeForDataType[selectedProperty.dataType]).map(
                                (value) => (
                                    <MenuItem value={value} key={value}>
                                        {NotifyTypeText[value]}
                                    </MenuItem>
                                )
                            )}
                        />
                    </Grid>
                    {selectedType && selectedType !== NotifyType.always ? (
                        <Grid item md={4} xs={12}>
                            <FieldConnector
                                component={isEnum ? 'Select' : 'TextField'}
                                deepPath={`EDIT_NOTIFY.value.${id}`}
                                fieldProps={{
                                    fullWidth: true,
                                    type: isNumerical ? 'number' : 'text',
                                }}
                                selectOptions={
                                    isEnum
                                        ? (selectedProperty as IThingPropertyEnum).format.map((label) => (
                                              <MenuItem value={label} key={label}>
                                                  {label}
                                              </MenuItem>
                                          ))
                                        : undefined
                                }
                            />
                        </Grid>
                    ) : null}
                </Fragment>
            ) : null}
        </Fragment>
    );
}

export default PropertyPart;
