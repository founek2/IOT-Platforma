import { Grid } from "@material-ui/core";
import type { IDevice } from "common/lib/models/interface/device";
import FieldConnector from "framework-ui/lib/Components/FieldConnector";
import * as formsActions from "framework-ui/lib/redux/actions/formsData";
import { DeviceForm } from "frontend/src/components/DeviceForm";
import { map } from "ramda";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as userNameActions from "../../store/actions/application/userNames";
import { IState } from "../../types";
import { getUserNames } from "../../utils/getters";

interface DiscoverySectionProps {
    devices?: IDevice[];
    resetEditDeviceAction: any;
    deleteDiscoveryAction: any;
    updateFormField: any;
    fetchUserNames: any;
    userNames: IState["application"]["userNames"];
}

function EditDeviceForm({ userNames, fetchUserNames }: DiscoverySectionProps) {
    useEffect(() => {
        fetchUserNames();
    }, []);

    return (
        <>
            <DeviceForm formName="EDIT_DEVICE" />
            {userNames.data.length && (
                <>
                    <Grid item md={6}>
                        <FieldConnector
                            deepPath="EDIT_DEVICE.permissions.read"
                            component="ChipArray"
                            optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                        // className={classes.chipArray}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <FieldConnector
                            deepPath="EDIT_DEVICE.permissions.control"
                            component="ChipArray"
                            optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                        // className={classes.chipArray}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <FieldConnector
                            deepPath="EDIT_DEVICE.permissions.write"
                            component="ChipArray"
                            optionsData={map(({ _id, userName }) => ({ value: _id, label: userName }), userNames.data)}
                        // className={classes.chipArray}
                        />
                    </Grid>
                </>
            )}
        </>
    );
}

const _mapStateToProps = (state: any) => {
    return {
        userNames: getUserNames(state),
    };
};

const _mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            resetEditDeviceAction: formsActions.removeForm("EDIT_DEVICE"),
            fetchUserNames: userNameActions.fetch,
        },
        dispatch
    );

export default connect(_mapStateToProps, _mapDispatchToProps)(EditDeviceForm as any);
