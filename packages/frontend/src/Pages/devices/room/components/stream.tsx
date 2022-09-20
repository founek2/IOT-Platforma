import { makeStyles } from '@material-ui/core/styles';
import { logger } from 'framework-ui/src/logger';
import React, { useEffect, useState } from 'react';
import CardMedia from '@material-ui/core/CardMedia';

const useStyles = makeStyles((theme) => ({}));

async function fetchContentType(url: string): Promise<string | undefined | void> {
    return fetch(url, {
        method: 'HEAD',
    })
        .then((res) => res.headers.get('content-type') || undefined)
        .catch((err) => {
            logger.error('Unable get contentType from stream at:', url, err);
        });
}

interface HttpStreamViewerProps {
    url: string;
    disabled?: boolean;
}
export function HttpStreamViewer({ url, disabled }: HttpStreamViewerProps) {
    const classes = useStyles();
    const [streamType, setStreamType] = useState<string>('');

    useEffect(() => {
        fetchContentType(url).then((type) => type && setStreamType(type));
    }, [url]);

    if (streamType.startsWith('video')) return <CardMedia src={url} autoPlay component="video" controls />;
    // return (
    //     <video autoPlay>
    //         <source src={url} type="video/mp4" />
    //     </video>
    // );

    if (streamType.startsWith('image')) return <img src={url} alt="stream" />;

    return <div>{url}</div>;
}
