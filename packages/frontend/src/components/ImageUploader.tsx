import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import { getFormData, getFieldVal } from 'framework-ui/src/utils/getters';
import { useSelector } from 'react-redux';
import { IMAGES_PREFIX_FOLDER } from '../constants';

const useStyles = makeStyles((theme) => ({
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    mediaWrapper: {
        display: 'inline-block',
        // width: 300,
        // paddingLeft: theme.spacing(1),
        // paddingRight: theme.spacing(1),
        // paddingTop: theme.spacing(3),
        // paddingBottom: theme.spacing(2),
        // [theme.breakpoints.down('sm')]: {
        //     width: '90%',
        // }
    },
    fileRoot: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
}));

interface ImageUploaderProps {
    deepPath: string;
    defaultImage?: string;
    onChange?: (e: any) => void;
}
// material-ui-avatar-picker could be rewritten for use in this App - current version is just old and too big (size)
// default image must BE there -> otherwise buggy
function ImageUploader({ deepPath, defaultImage = '/defaultDevice.png', onChange }: ImageUploaderProps) {
    const classes = useStyles();
    const fileObj: { name: string; url: string } | undefined = useSelector(getFieldVal(deepPath));

    return (
        <div className={classes.fileRoot}>
            <div className={classes.mediaWrapper}>
                <CardMedia className={classes.media} image={fileObj?.url || IMAGES_PREFIX_FOLDER + defaultImage} />
            </div>
            <FieldConnector deepPath={deepPath} component="FileLoader" onChange={onChange} />
        </div>
    );
}

export default ImageUploader;
