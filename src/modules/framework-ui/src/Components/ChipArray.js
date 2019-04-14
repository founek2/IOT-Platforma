import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { map, indexOf, remove, append, concat, equals, difference, clone } from 'ramda';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const createListItems = (array, clickHandler, classes) => {
     const createOption = obj => (
          <ListItem key={obj.value} className={classes.listItem} onClick={() => clickHandler(obj)}>
               <ListItemText primary={obj.label} classes={{ primary: classes.itemText }} />
          </ListItem>
     );
     return map(createOption, array);
};

const styles = theme => ({
     root: {
          width: 320,
          height: 170,
          float: 'left'
     },
     chip: {
          margin: theme.spacing.unit / 2
     },
     select: {
          marginLeft: theme.spacing.unit,
          marginRight: theme.spacing.unit,
          marginTop: theme.spacing.unit,
          width: 200
     },
     list: {
          width: 152,
          backgroundColor: theme.palette.background.paper,
          position: 'relative',
          overflow: 'auto',
          float: 'left',
          height: 150
          // borderRight: '1px solid rgba(0, 0, 0, 0.42)',
     },
     listSection: {
          backgroundColor: 'inherit'
     },
     ul: {
          backgroundColor: 'inherit',
          padding: 0
     },
     itemText: {
          fontSize: 14
     },
     listItem: {
          paddingLeft: theme.spacing.unit,
          paddingRight: theme.spacing.unit,
          paddingTop: 2,
          paddingBottom: 2
     },
     listHeader: {
          paddingLeft: theme.spacing.unit,
          paddingRight: theme.spacing.unit,
          height: 40
     },
     chipContainer: {
          padding: theme.spacing.unit,
          maxWidth: 370,
          height: 170,
          overflowY: 'scroll',
          overflowX: 'hidden'
     },
     errorColor: {
          color: '#f44336'
     }
});

class ChipArray extends Component {
     constructor(props) {
          super(props);
          this.state = {
               chipData: [],
               options: [...props.optionsData]
               // optionsData: props.optionsData,
          };
     }
     componentWillReceiveProps({ optionsData, value }) {
          const prevOptionsData = this.props.optionsData;
          if (!equals(prevOptionsData, optionsData)) {
               this.syncOptions(optionsData);
          }
          if (!this.state.gotValue && !equals(this.state.chipData.map(({ value }) => value), value)) {
               if (value) {
                    
                    const { options, chipData } = this.state;
                    let newChipData = clone(chipData);
                    let newOptions = clone(options);
                    value.forEach(val => {
                         const option = this.state.options.find(obj => obj.value === val);
                         if (option) {
                              const index = indexOf(option, newOptions);
                              newChipData = append(option, newChipData);
                              newOptions = remove(index, 1, newOptions);
                         }
				});
				this.setState({
                         options: newOptions,
					chipData: newChipData,
					gotValue: true,
                    });
			} 
          } else {
			if (!value) {
				this.setState({
                         options: optionsData,
					chipData: [],
                    });
			}
		}
     }
     syncOptions = newOptionsData => {
          // TODO now it is just for adding, not for removing
          const { options, chipData } = this.state;
          const diff = difference(newOptionsData, [...options, ...chipData]);
          console.log('diff', concat(options, diff));
          this.setState({
               options: concat(options, diff)
               // optionsData: newOptionsData,
          });
     };
     handleDelete = data => () => {
          const { chipData, options } = this.state;
          const index = indexOf(data, chipData);
          const newChipData = remove(index, 1, chipData);
          this.setState({
               chipData: newChipData,
               options: append(data, options)
          });
          const { onChange } = this.props;
          onChange({ target: { value: newChipData.map(obj => obj.value) } });
     };
     handleAddChip = (option, sync = false) => {
          const { options, chipData } = this.state;
          const index = indexOf(option, options);
          const newChipData = append(option, chipData);
          this.setState({
               options: remove(index, 1, options),
               chipData: newChipData
          });
          if (!sync) {
               const { onChange } = this.props;
               onChange({ target: { value: newChipData.map(obj => obj.value) } });
          }
     };
     initChipData = chipData => {};
     render() {
          const { classes, onChange, onFocus, onBlur, optionsData, label, required, error, ...other } = this.props;
          const { chipData, options } = this.state;
          const createChip = data => (
               <Chip key={data.value} label={data.label} onDelete={this.handleDelete(data)} className={classes.chip} />
          );

          const chips = map(createChip, chipData);
          const listItems = createListItems(options, this.handleAddChip, classes);
          const requiredStar = required ? <span>&thinsp;*</span> : null;
          return (
               <div className={classes.root}>
                    <List className={classes.list} subheader={<li />}>
                         <li className={classes.listSection}>
                              <ul className={classes.ul}>
                                   <ListSubheader className={`${classes.listHeader} ${error ? classes.errorColor : ''}`}>
                                        {label} {requiredStar}
                                   </ListSubheader>
                                   {listItems}
                              </ul>
                         </li>
                    </List>
                    <div className={classes.chipContainer}>{chips}</div>
               </div>
          );
     }
}

export default withStyles(styles)(ChipArray);
