import React, { Fragment } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
// import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Dialog from '../Dialog';
import { compose } from 'ramda';
import SearchField from './SearchField';

const toolbarStyles = (theme) => ({
    root: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2)
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85)
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark
              },
    spacer: {
        flex: '1 1 80%'
    },
    actions: {
        color: theme.palette.text.secondary
    },
    title: {
        display: 'flex'
    },
    search: {
        marginLeft: '2em'
    }
});

class EnhancedTableToolbar extends React.Component {
    state = {
        alert: { open: false }
    };
    openAlert = () => {
        this.setState({
            alert: { open: true }
        });
    };
    closeAlert = () => {
        this.setState({
            alert: { open: false }
        });
    };

    render() {
        const {
            numSelected,
            classes,
            headLabel,
            onDelete,
            onAdd,
            enableCreation,
            onSearchChange,
            enableSearch,
            className
        } = this.props;

        return (
            <Fragment>
                <Toolbar
                    className={clsx(
                        classes.root,
                        {
                            [classes.highlight]: numSelected > 0
                        },
                        className
                    )}
                >
                    <div className={classes.title}>
                        {numSelected > 0 ? (
                            <Typography color="inherit" variant="subtitle1">
                                {numSelected} selected
                            </Typography>
                        ) : (
                            <Fragment>
                                <Typography variant="h5" id="tableTitle">
                                    {headLabel}
                                </Typography>
                                {enableSearch ? (
                                    <SearchField
                                        onChange={onSearchChange}
                                        placeholder="Vyhledávání"
                                        className={classes.search}
                                    />
                                ) : null}
                            </Fragment>
                        )}
                    </div>
                    {numSelected > 0 ? <div className={classes.spacer} /> : null}
                    <div className={classes.actions}>
                        {numSelected > 0 ? (
                            <Tooltip title="Delete">
                                <IconButton aria-label="Delete" onClick={this.openAlert}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Fragment>
                                {enableCreation && (
                                    <Fab color="primary" aria-label="Add" size="small" onClick={onAdd}>
                                        <AddIcon />
                                    </Fab>
                                )}
                                {/* <Tooltip title="Filter list">
                                   <IconButton aria-label="Filter list">
                                        <FilterListIcon />
                                   </IconButton>
                              </Tooltip> */}
                            </Fragment>
                        )}
                    </div>
                </Toolbar>
                <Dialog
                    open={this.state.alert.open}
                    onClose={this.closeAlert}
                    onAgree={async (id) => {
                        await onDelete(id);
                        this.closeAlert();
                    }}
                    cancelText="Zrušit"
                    content="Opravdu chcete odstranit vybrané položky? Tato akce je nevratná."
                    title="Odstranění vybraných položek"
                />
            </Fragment>
        );
    }
}

EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
