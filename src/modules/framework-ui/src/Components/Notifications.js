import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import SnackbarItem from './Notifications/SnackbarItem';
import { TRANSITION_DELAY, TRANSITION_DOWN_DURATION } from './Notifications/utils/constants';
import { connect } from 'react-redux';
import { difference, keys } from 'ramda';
import { getNotifications } from '../utils/getters';
import { bindActionCreators } from 'redux';
import * as notActions from '../redux/actions/application/notifications';

class NotificationsProvider extends Component {
     state = {
          snacks: []
     };

     queue = [];

     /**
      * Adds a new snackbar to the queue to be presented.
      * @param {string} variant - type of the snackbar. can be:
      * (success, error, warning, info)
      * @param {string} message - text of the notification
      */
     UNSAFE_componentWillReceiveProps({ notifications }) {
		const addedNotification = difference(keys(notifications), keys(this.props.notifications));
		addedNotification.forEach((key) => {
			this.handlePresentSnackbar(notifications[key]);
		})
		//this.handlePresentSnackbar(lastNot)
     }
     handlePresentSnackbar = ({message, variant, key}) => {
          this.queue.push({
               message,
               variant,
               open: true,
               key
          });
          this.handleDisplaySnack();
     };

     /**
      * Display snack if there's space for it.
      * Otherwise, immediately begin dismissing the
      * oldest message to start showing the new one.
      */
     handleDisplaySnack = () => {
          const { maxSnack } = this.props;
          const { snacks } = this.state;
          if (snacks.length >= maxSnack) {
               return this.handleDismissOldest();
          }
          return this.processQueue();
     };

     /**
      * Display items (notifications) in the queue
      * if there's space for them
      */
     processQueue = () => {
          if (this.queue.length > 0) {
               const { snacks } = this.state;
               const newOne = this.queue.shift();
               this.setState({
                    snacks: [...snacks, newOne]
               });
          }
     };

     /**
      * Hide oldest snackbar on the screen because
      * there exists a new one which we have to display.
      */
     handleDismissOldest = () => {
          const { snacks } = this.state;
          let snacksCopy = JSON.parse(JSON.stringify(snacks));
          snacksCopy = snacksCopy.filter(item => item.open === true);
          snacksCopy[0].open = false;   // TODO one time it throwed exception "Cannot set property 'open' of undefined"
          this.setState({ snacks: snacksCopy });
     };

     /**
      * Hide a snackbar after its timeout.
      * @param {number} key - id of the snackbar we want to hide
      */
     handleCloseSnack = key => {
          const { snacks } = this.state;
          const snacksCopy = JSON.parse(JSON.stringify(snacks));
          snacksCopy.find(item => item.key === key).open = false;
          this.setState({ snacks: snacksCopy });
     };

     /**
      * When we set open attribute of a snackbar
      * to false (i.e. after we hide a snackbar),
      * it leaves the screen and immediately after
      * leaving animation is done, this method gets
      * called. We remove the hidden snackbar from
      * state and then display notifications waiting
      * in the queue (if any).
      * @param {number} key - id of the snackbar we want to remove
      */
     handleExitedSnack = key => {
          const { snacks } = this.state;
          const enterDelay = TRANSITION_DELAY + TRANSITION_DOWN_DURATION + 40;
          let snacksCopy = JSON.parse(JSON.stringify(snacks));
          snacksCopy = snacksCopy.filter(item => item.key !== key);
          this.setState({ snacks: snacksCopy }, () => {
               setTimeout(this.handleDisplaySnack, enterDelay);
		});
		this.props.removeNotification(key);
     };

     render() {
          const { children, anchorOrigin } = this.props;
          const { snacks } = this.state;

          return (
               <Fragment>
                    {children}
                    {snacks.map((snack, index) => (
                         <SnackbarItem
                              key={snack.key}
                              level={index}
                              snack={snack}
                              onClose={this.handleCloseSnack}
						onExited={this.handleExitedSnack}
						anchorOrigin={anchorOrigin}
                         />
                    ))}
               </Fragment>
          );
     }
}

NotificationsProvider.propTypes = {
     /**
      * Maximum snackbars that can be stacked
      * on top of one another
      */
     maxSnack: PropTypes.number
};

NotificationsProvider.defaultProps = {
     maxSnack: 3
};
const _mapStateToProps = state => ({
     notifications: getNotifications(state)
})

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
			closeNotification: notActions.closeNotification,
			setNotification: notActions.setNotification,
			removeNotification: notActions.removeNotification
          },
          dispatch
     );
export default connect(_mapStateToProps, _mapDispatchToProps)(NotificationsProvider);
