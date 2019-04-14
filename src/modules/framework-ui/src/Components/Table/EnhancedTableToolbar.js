import React, { Fragment } from 'react';
import classNames from 'classnames';
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
import AlertDialog from './AlertDialog';
import {compose} from 'ramda';

const toolbarStyles = theme => ({
     root: {
          paddingRight: 24
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
          flex: '0 0 auto'
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
          const { numSelected, classes, headLabel, onDelete, onAdd, enableCreation } = this.props;

          return (
               <Fragment>
                    <Toolbar
                         className={classNames(classes.root, {
                              [classes.highlight]: numSelected > 0
                         })}
                    >
                         <div className={classes.title}>
                              {numSelected > 0 ? (
                                   <Typography color="inherit" variant="subtitle1">
                                        {numSelected} selected
                                   </Typography>
                              ) : (
                                   <Typography variant="h5" id="tableTitle">
                                        {headLabel}
                                   </Typography>
                              )}
                         </div>
                         <div className={classes.spacer} />
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
				<AlertDialog 
					open={this.state.alert.open}
					onClose={this.closeAlert}
					onAgree={compose(this.closeAlert,onDelete)}
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
