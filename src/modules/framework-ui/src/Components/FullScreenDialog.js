import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
     appBar: {
		position: 'relative',
	   },
	   flex: {
		flex: 1,
	   },
});

function Transition(props) {
	return <Slide direction="up" {...props} />;
   }

function OwnDialog({ open, TransitionComponent = Transition, heading, children, onClose, classes}) {
     return (
          <Dialog fullScreen open={open} TransitionComponent={TransitionComponent}>
               <AppBar className={classes.appBar}>
                    <Toolbar>
                         <IconButton color="inherit" onClick={onClose} aria-label="Close">
                              <CloseIcon />
                         </IconButton>
                         <Typography variant="h5" color="inherit" className={classes.flex}>
                              {heading}
                         </Typography>
                    </Toolbar>
               </AppBar>
               {children}
          </Dialog>
     );
}

export default withStyles(styles)(OwnDialog)