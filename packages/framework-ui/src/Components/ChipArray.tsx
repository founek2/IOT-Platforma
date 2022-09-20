import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { map, indexOf, remove, append, concat, equals, difference, clone } from 'ramda';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';

const styles = (theme) => ({
    root: {
        display: 'flex',
        // flexWrap: "wrap"
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    list: {
        // width: "10%",
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflowY: 'auto',
        // overflowX: 'visible',
        // maxHeight: 300,
        // borderRight: '1px solid rgba(0, 0, 0, 0.42)',
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        paddingRight: 10,
        paddingLeft: 0,
    },
    itemText: {
        fontSize: 14,
    },
    listItem: {
        paddingLeft: 0,
        paddingRight: theme.spacing(3),
        paddingTop: 2,
        paddingBottom: 2,
        cursor: 'pointer',
    },
    listHeader: {
        paddingLeft: 0,
        paddingRight: theme.spacing(1),
        height: 40,
        fontSize: 16,
        whiteSpace: 'pre',
    },
    chipContainer: {
        padding: theme.spacing(1),
        // maxWidth: 370,
        overflowY: 'auto',
        overflowX: 'hidden',
    },
    errorColor: {
        color: '#f44336',
    },
    listWrapper: {
        // maxWidth: '45%',
        overflowX: 'visible',
        display: 'flex',
    },
});

const createListItems = (array, clickHandler, classes) => {
    const createOption = (obj) => (
        <ListItem key={obj.value} className={classes.listItem} onClick={() => clickHandler(obj)}>
            <ListItemText primary={obj.label} classes={{ primary: classes.itemText }} />
        </ListItem>
    );
    return map(createOption, array);
};

class ChipArray extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chipData: [],
            options: [...props.optionsData],
            // optionsData: props.optionsData,
        };
    }
    componentWillReceiveProps({ optionsData, value }) {
        //@ts-ignore
        const prevOptionsData = this.props.optionsData;
        if (!equals(prevOptionsData, optionsData)) {
            this.syncOptions(optionsData);
        }
        if (
            //@ts-ignore
            !this.state.gotValue &&
            !equals(
                //@ts-ignore
                this.state.chipData.map(({ value }) => value),
                value
            )
        ) {
            if (value) {
                //@ts-ignore
                const { options, chipData } = this.state;
                let newChipData = clone(chipData);
                let newOptions = clone(options);
                value.forEach((val) => {
                    //@ts-ignore
                    const option = this.state.options.find((obj) => obj.value === val);
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
    syncOptions = (newOptionsData) => {
        //@ts-ignore
        const { options, chipData } = this.state;
        const diff = difference(newOptionsData, [...options, ...chipData]);
        this.setState({
            options: concat(options, diff),
            // optionsData: newOptionsData,
        });
    };
    handleDelete = (data) => () => {
        //@ts-ignore
        const { chipData, options } = this.state;
        const index = indexOf(data, chipData);
        const newChipData = remove(index, 1, chipData);
        this.setState({
            chipData: newChipData,
            options: append(data, options),
        });
        //@ts-ignore
        const { onChange } = this.props;
        //@ts-ignore
        onChange({ target: { value: newChipData.map((obj) => obj.value) } });
    };
    handleAddChip = (option, sync = false) => {
        //@ts-ignore
        const { options, chipData } = this.state;
        const index = indexOf(option, options);
        const newChipData = append(option, chipData);
        this.setState({
            options: remove(index, 1, options),
            chipData: newChipData,
        });
        if (!sync) {
            //@ts-ignore
            const { onChange } = this.props;
            onChange({ target: { value: newChipData.map((obj) => obj.value) } });
        }
    };

    render() {
        //@ts-ignore
        const { classes, label, required, error, className } = this.props;
        //@ts-ignore
        const { chipData, options } = this.state;
        const createChip = (data) => (
            <Chip
                key={data.value}
                label={data.label}
                onClick={this.handleDelete(data)}
                onDelete={this.handleDelete(data)}
                className={classes.chip}
            />
        );

        const chips = map(createChip, chipData);
        const listItems = createListItems(options, this.handleAddChip, classes);
        const requiredStar = required ? ' *' : null;
        return (
            <div className={`${classes.root} ${className}`}>
                <div className={classes.listWrapper}>
                    <List className={classes.list} subheader={<li />}>
                        <li className={classes.listSection}>
                            <ul className={classes.ul}>
                                <ListSubheader className={`${classes.listHeader} ${error ? classes.errorColor : ''}`}>
                                    {label} {requiredStar}
                                </ListSubheader>
                                <Divider />
                                {listItems}
                            </ul>
                        </li>
                    </List>
                </div>
                <div className={classes.chipContainer}>{chips}</div>
            </div>
        );
    }
}

//@ts-ignore
export default withStyles(styles)(ChipArray);
