import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import clsx from 'clsx';
import React, { Fragment } from 'react';
import Dialog from '../Dialog';
import SearchField from './SearchField';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingRight: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                  color: theme.palette.secondary.main,
                  backgroundColor: lighten(theme.palette.secondary.light, 0.85),
              }
            : {
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.secondary.dark,
              },
    spacer: {
        flex: '1 1 80%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        display: 'flex',
    },
    search: {
        marginLeft: '2em',
    },
}));

interface EnhancedTableToolbarProps {
    numSelected: number;
    headLabel: string;
    onDelete: (id: any) => void | Promise<any>;
    onAdd: (e: any) => void;
    enableCreation: boolean;
    onSearchChange;
    enableSearch: boolean;
    className?: string;
}
function EnhancedTableToolbar({
    numSelected,
    headLabel,
    onDelete,
    onAdd,
    enableCreation,
    onSearchChange,
    enableSearch,
    className,
}: EnhancedTableToolbarProps) {
    const classes = useStyles();
    const [openAlert, setOpenAlert] = React.useState(false);

    function closeAlert() {
        setOpenAlert(false);
    }

    return (
        <Fragment>
            <Toolbar
                className={clsx(
                    classes.root,
                    {
                        [classes.highlight]: numSelected > 0,
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
                            <IconButton aria-label="Delete" onClick={() => setOpenAlert(true)}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Fragment>
                            {enableCreation && (
                                <IconButton aria-label="Add" size="medium" onClick={onAdd}>
                                    <AddIcon />
                                </IconButton>
                            )}
                        </Fragment>
                    )}
                </div>
            </Toolbar>
            <Dialog
                open={openAlert}
                onClose={closeAlert}
                onAgree={async (id) => {
                    await onDelete(id);
                    closeAlert();
                }}
                cancelText="Zrušit"
                content="Opravdu chcete odstranit vybrané položky? Tato akce je nevratná."
                title="Odstranění vybraných položek"
            />
        </Fragment>
    );
}

export default EnhancedTableToolbar;
