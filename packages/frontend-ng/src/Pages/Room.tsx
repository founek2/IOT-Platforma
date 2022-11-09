import { CircularProgress } from '@mui/material';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog } from '../components/Dialog';
import { useDevicesQuery } from '../endpoints/devices';
import { useLazyThingHistoryQuery, useUpdateThingStateMutation } from '../endpoints/thing';
import { useAppSelector } from '../hooks';
import { useAppBarContext } from '../hooks/useAppBarContext';
import { ThingContext } from '../hooks/useThing';
import { getThing } from '../selectors/getters';
import PropertyRow from './room/PropertyRow';
import Room from './room/Room';

export interface RoomProps {
    title?: string;
}
export default function RoomPage({ title }: RoomProps) {
    const { isLoading } = useDevicesQuery(undefined, { pollingInterval: 10 * 60 * 1000 });
    const [urlSearchParams] = useSearchParams();
    const thing = useAppSelector(getThing(urlSearchParams.get('thingId') || ''));
    const { setAppHeader, resetAppHeader } = useAppBarContext();
    const navigate = useNavigate();
    const [fetchHistory, { data: historyData }] = useLazyThingHistoryQuery();
    const [updatePropertyState] = useUpdateThingStateMutation();

    useEffect(() => {
        if (thing) fetchHistory({ deviceID: thing.deviceId, thingID: thing.config.nodeId });
    }, [thing?._id]);

    return (
        <>
            {isLoading ? <CircularProgress /> : <Room title={title} mode="things" />}
            <Dialog
                open={Boolean(thing)}
                onClose={() => navigate({ search: '' }, { replace: true })}
                title={thing?.config.name}
                // sx={{ minWidth: 600 }}
                fullWidth
            >
                <>
                    {thing
                        ? thing.config.properties.map((property, i) => (
                              <ThingContext.Provider value={thing} key={property._id}>
                                  <PropertyRow
                                      sx={{ paddingBottom: 2 }}
                                      key={property.propertyId}
                                      property={property}
                                      value={thing.state?.value[property.propertyId]}
                                      timestamp={thing.state?.timestamp ? new Date(thing.state.timestamp) : undefined}
                                      onChange={(value) =>
                                          updatePropertyState({
                                              deviceId: thing.deviceId,
                                              propertyId: property.propertyId,
                                              thingId: thing._id,
                                              nodeId: thing.config.nodeId,
                                              value,
                                          })
                                      }
                                      history={historyData}
                                      defaultShowDetail={i === 0}
                                  />
                              </ThingContext.Provider>
                          ))
                        : null}
                </>
            </Dialog>
        </>
    );
}
