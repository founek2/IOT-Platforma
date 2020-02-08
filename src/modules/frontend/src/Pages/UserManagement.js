import React, { Component } from 'react';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { formsDataActions } from 'framework-ui/src/redux/actions';
import * as usersActions from 'framework-ui/src/redux/actions/application/users';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getGroups, getUsers, isUrlHash } from 'framework-ui/src/utils/getters';
import EnchancedTable from 'framework-ui/src/Components/Table';
import FullScreenDialog from 'framework-ui/src/Components/FullScreenDialog';
import { merge, equals, pick, isEmpty } from 'ramda';
import arrToString from 'framework-ui/src/utils/arrToString';
import { getAllowedGroups } from 'framework-ui/src/privileges';
import { isGroupAllowed } from 'framework-ui/src/privileges'
import EditUser from './userManagement/EditUser'

import { getQueryID } from '../utils/getters'

function convertGroupIDsToName(groups) {
     return function (arr) {
          return arrToString(
               arr.map(id => {
                    if (isEmpty(groups)) return id;
                    const group = groups.find(obj => obj.group === id);
                    if (!group) return id;
                    return group.text;
               })
          );
     };
}
const userProps = (groups) => [
     { path: 'info.userName', label: 'Uživatelské jméno' },
     { path: 'info.firstName', label: 'Jméno' },
     { path: 'info.lastName', label: 'Přijmení' },
     { path: 'info.email', label: 'Email' },
     { path: 'info.phoneNumber', label: 'Telefon' },
     { path: 'groups', label: 'Uživ. skupiny', convertor: convertGroupIDsToName(groups) },
     { path: 'createdAt', label: 'Vytvořen', convertor: val => new Date(val).toLocaleDateString() }
];

const styles = theme => ({
     errorColor: {
          color: theme.errorColor
     }
});

class UserManagement extends Component {
     constructor(props) {
          super(props);
          this.state = {
               createForm: {
                    open: false
               },
               editForm: {
                    open: false
               }
          };
     }
     componentWillMount() {
          this.props.fetchAllUsers();
     }
     handleDelete = arryOfIDs => {
          this.props.deleteUsers(arryOfIDs);
     };
     updateCreateForm = obj => {
          this.setState(state => ({
               createForm: merge(state.createForm, obj)
          }));
     };
     updateEditForm = obj => {
          const { fillUserForm, users } = this.props;
          if (obj.open === true) {
               const userTarget = users.find(user => user.id === obj.userID);
               fillUserForm(pick(['userName', 'firstName', 'lastName', 'email', 'phoneNumber', 'groups'], userTarget));
          }
          this.setState(state => ({
               editForm: merge(state.createForm, obj)
          }));
     };
     render() {
          const { classes, groups, users, selectedUser, userID, updateUserAction, history } = this.props;
          const isAdmin = isGroupAllowed("admin", groups)
          return (
               <div className={classes.root}>
                    <Card className={classes.card}>
                         <CardHeader title="Správa uživatelů" />
                         <CardContent>
                              <FieldConnector
                                   deepPath="USER_MANAGEMENT.selected"
                                   component={
                                        () =>
                                             <EnchancedTable
                                                  dataProps={userProps(getAllowedGroups(groups))}
                                                  data={users}
                                                  toolbarHead="Seznam"
                                                  onDelete={this.handleDelete}
                                                  orderBy="userName"
                                                  // enableCreation={isAdmin}
                                                  onAdd={() => this.updateCreateForm({ open: true })}
                                                  enableEdit={isAdmin}
                                                  onEdit={id => history.push({ hash: "editUser", search: "?id=" + id })}
                                                  rowsPerPage={10}
                                             />
                                   }
                              />
                         </CardContent>
                         <CardActions />
                    </Card>
                    {/* <FullScreenDialog
                         open={this.state.createForm.open}
                         onClose={() => this.updateCreateForm({ open: false })}
                         heading="Vytvoření uživatele"
                    >
                          <UserForm onButtonClick={createUser} buttonLabel="Vytvořit" />
                    </FullScreenDialog> */}
                    <FullScreenDialog
                         open={!!selectedUser && this.props.openEditDialog}
                         onClose={() => history.push({ hash: '', search: '' })}
                         heading="Editace uživatele"
                    >
                         <EditUser
                              onButtonClick={() => updateUserAction(userID)}
                              buttonLabel="Uložit"
                              user={selectedUser}
                         />
                    </FullScreenDialog>
               </div>
          );
     }
}

const _mapStateToProps = state => {
     const id = getQueryID(state)
     return {
          userID: id,
          groups: getGroups(state),
          users: getUsers(state),
          openEditDialog: isUrlHash('#editUser')(state),
          selectedUser: getUsers(state).find(user => user.id === id),
     }
};

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               fetchAllUsers: usersActions.fetchAll,
               updateUserAction: usersActions.updateUser,
               deleteUsers: usersActions.deleteUsers,
               createUser: usersActions.create,
               fillUserForm: formsDataActions.fillForm('USER'),
               resetUserForm: formsDataActions.resetForm('USER')
          },
          dispatch
     );

export default withStyles(styles)(
     connect(
          _mapStateToProps,
          _mapDispatchToProps
     )(UserManagement)
);
