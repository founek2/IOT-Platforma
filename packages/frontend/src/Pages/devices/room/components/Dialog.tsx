import { blue } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/Close";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IDevice } from "common/lib/models/interface/device";
import { IThing } from "common/lib/models/interface/thing";
import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
    closeButton: {
        marginRight: 10,
    },
    moreButton: {
        float: "right",
    },
    content: {
        overflowY: "initial",
    }
});

export interface SimpleDialogProps {
    open: boolean;
    onClose: (value: any) => void;
    title: string;
    deviceId: IDevice["_id"];
    thing: IThing;
    children: (JSX.Element | null)[] | JSX.Element | null;
    classContent?: string
}

export function SimpleDialog({ onClose, open, title, children, deviceId, thing, classContent }: SimpleDialogProps) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMoreClose = () => {
        setAnchorEl(null);
    };

    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open} fullWidth fullScreen={isSmall}>
            <DialogTitle id="simple-dialog-title">
                <IconButton onClick={onClose} className={classes.closeButton}>
                    <CloseIcon />
                </IconButton>
                {title}
                <IconButton onClick={handleMoreClick} className={classes.moreButton}>
                    <MoreVertIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={clsx(classContent, classes.content)}>{children}</DialogContent>
            <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMoreClose}>
                <Link to={"/device/" + deviceId + "/thing/" + thing.config.nodeId + "/notify"}>
                    <MenuItem onClick={handleMoreClose}>Notifikace</MenuItem>
                </Link>
                {/* <MenuItem onClick={handleMoreClose}>My account</MenuItem>
				<MenuItem onClick={handleMoreClose}>Logout</MenuItem> */}
            </Menu>
        </Dialog>
    );
}
