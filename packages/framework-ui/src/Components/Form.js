import React, { Component } from 'react';
import FieldConnector from './FieldConnector';
import Loader from './Loader';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import { map } from 'ramda';
import { isPending, setPending } from '../utils/pending';

const styles = theme => {
    return {
        card: {
            overflow: 'auto',
            margin: '0px auto',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            width: 470,
            marginTop: 0,

            [theme.breakpoints.down('sm')]: {
                width: '100%',
                height: '100%'
            },
            [theme.breakpoints.down('xs')]: {
                width: '100%'
            }
        },
        root: {
            position: 'relative',
        },
        actions: {
            marginTop: theme.spacing(4),
            margin: 'auto',
            width: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        header: {
            paddingBottom: 0,
        }
    };
};

const generateFields = fieldArray => {
    const createField = props => {
        return <FieldConnector {...props} key={props.deepPath} />;
    };

    return map(createField, fieldArray);
};

class CreateUserForm extends Component {
    state = {};
    componentWillMount() {
        const { onMount } = this.props;
        if (onMount) onMount();
    }
    handleButtonClick = e => {
        if (!isPending(this)) {
            setPending(true, this);
            const call = this.props.onButtonClick(e);
            if (call instanceof Promise) {
                call.then(() => setPending(false, this));
            } else {
                setPending(false, this);
            }
        }
    };
    render() {
        const { classes, buttonLabel, fieldsData, cardClass, title } = this.props;

        return (
            <Card className={`${cardClass} ${classes.card} ${classes.root}`}>
                {title && <CardHeader className={classes.header} title={title} />}
                <CardContent>{generateFields(fieldsData)}</CardContent>
                <CardActions className={classes.actions}>
                    <Button
                        color="primary"
                        variant="contained"
                        className={classes.button}
                        onClick={this.handleButtonClick}
                    >
                        {buttonLabel}
                    </Button>
                    <Loader open={isPending(this)} />
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(styles)(CreateUserForm);
