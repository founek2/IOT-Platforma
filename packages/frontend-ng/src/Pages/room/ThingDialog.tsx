import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Dialog } from '../../components/Dialog';
import { useLazyThingHistoryQuery, useUpdateThingStateMutation } from '../../endpoints/thing';
import { useAppSelector } from '../../hooks';
import { ThingContext } from '../../hooks/useThing';
import { useUpdateThingStateSmart } from '../../hooks/useUpdateThingStateSmart';
import { getThing } from '../../selectors/getters';
import PropertyRow from '.././room/PropertyRow';

export function ThingDialog() {
    const [urlSearchParams] = useSearchParams();
    const thingId = urlSearchParams.get('thingId') || '';
    const thing = useAppSelector(getThing(thingId));
    const navigate = useNavigate();
    const [fetchHistory, { data: historyData }] = useLazyThingHistoryQuery();
    const { mutateThingState } = useUpdateThingStateSmart(thingId);
    useEffect(() => {
        if (thing) fetchHistory({ deviceID: thing.deviceId, thingID: thing.config.nodeId });
    }, [thing?._id]);

    return (
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
                                  state={thing.state?.[property.propertyId]}
                                  onChange={(value) => {
                                      console.log('clicked');
                                      mutateThingState({
                                          propertyId: property.propertyId,
                                          value,
                                      });
                                  }}
                                  history={historyData}
                                  defaultShowDetail={i === 0}
                              />
                          </ThingContext.Provider>
                      ))
                    : null}
            </>
        </Dialog>
    );
}
