import { makeStyles } from '@material-ui/core';
import { IThing } from 'common/src/models/interface/thing';
import { head } from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { devicesActions } from 'src/store/actions/application/devices';
import { thingHistoryActions } from 'src/store/actions/application/thingHistory';
import { getHistory, getQuery, getThing, getThingHistory } from 'src/utils/getters';
import { SimpleDialog } from './room/components/Dialog';
import PropertyRow from './room/components/PropertyRow';

const useStyles = makeStyles({
    dialogContent: {
        minHeight: 150,
    },
});

interface ThingDialogProps {
    room: string;
}
export function ThingDialog({ room }: ThingDialogProps) {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const queryParams = useAppSelector(getQuery) as { thingId?: string; deviceId?: string };
    const [_, setSearchParams] = useSearchParams();
    const thing: IThing | undefined = useAppSelector(getThing(queryParams.thingId));
    const historyData = useAppSelector(getThingHistory);
    const [openDialog, setOpenDialog] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        if (queryParams.thingId && !openDialog) {
            setOpenDialog(true);
            dispatch(thingHistoryActions.fetchHistory(queryParams.deviceId, thing.config.nodeId));
        } else if (!queryParams.thingId) setOpenDialog(false);
    }, [queryParams.thingId, queryParams.deviceId]);

    useEffect(() => {
        if (thing) setTitle(room + ' - ' + thing?.config.name!);
    }, [thing]);

    function handleClose() {
        setOpenDialog(false);
        setSearchParams({});
    }

    console.log('history data', historyData);
    return (
        <SimpleDialog
            open={openDialog}
            onClose={handleClose}
            title={title}
            deviceId={queryParams.deviceId}
            thingId={queryParams.thingId}
            classContent={classes.dialogContent}
        >
            <div>
                {thing
                    ? thing.config.properties.map((property, i) => (
                          <PropertyRow
                              key={property.propertyId}
                              property={property}
                              value={thing.state?.value[property.propertyId]}
                              timestamp={thing.state?.timestamp && new Date(thing.state.timestamp)}
                              onChange={(newValue: any) =>
                                  dispatch(
                                      devicesActions.updateState(queryParams.deviceId, thing._id, {
                                          [property.propertyId]: newValue,
                                      })
                                  )
                              }
                              history={historyData?.deviceId === queryParams.deviceId ? historyData : undefined}
                              defaultShowDetail={i === 0}
                          />
                      ))
                    : null}
            </div>
        </SimpleDialog>
    );
}
