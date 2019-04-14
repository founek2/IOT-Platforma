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
import { getGroups, getUsers, getUser } from 'framework-ui/src/utils/getters';
import EnchancedTable from 'framework-ui/src/Components/Table';
import FullScreenDialog from 'framework-ui/src/Components/FullScreenDialog';
// import UserForm from '../Components/UserForm';
import { merge, equals, pick, isEmpty } from 'ramda';
import arrToString from 'framework-ui/src/utils/arrToString';
import { getAllowedGroups } from 'framework-ui/src/privileges';

function convertGroupIDsToName(groups) {
     return function(arr) {
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
     { key: 'userName', label: 'Uživatelské jméno' },
     { key: 'firstName', label: 'Jméno' },
     { key: 'lastName', label: 'Přijmení' },
     { key: 'email', label: 'Email' },
     { key: 'phoneNumber', label: 'Telefon' },
     { key: 'groups', label: 'Uživ. skupiny', convertor: convertGroupIDsToName(groups) },
     { key: 'created', label: 'Vytvořen', convertor: val => new Date(val).toLocaleDateString() }
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
               const userTarget = users.find(user => user.id == obj.userID);
               fillUserForm(pick(['userName', 'firstName', 'lastName', 'email', 'phoneNumber', 'groups'], userTarget));
          }
          this.setState(state => ({
               editForm: merge(state.createForm, obj)
          }));
     };
     render() {
		const { classes, groups, users, createUser, updateUser, resetUserForm } = this.props;

          const isAdmin = groups.some(group => equals('userAdmin', group));
          const isRoot = groups.some(equals('root'));
          return (
               <div className={classes.root}>
                    <Card className={classes.card}>
                         <CardHeader title="Správa uživatelů" />
                         <CardContent>
                              <FieldConnector
                                   deepPath="USER_MANAGEMENT.selected"
                                   component={
                                        <EnchancedTable
                                             dataProps={userProps(getAllowedGroups(groups))}
                                             data={users}
                                             toolbarHead="Seznam"
                                             onDelete={this.handleDelete}
                                             orderBy="userName"
                                             enableCreation={isAdmin || isRoot}
                                             onAdd={() => this.updateCreateForm({ open: true })}
                                             enableEdit={isAdmin || isRoot}
									onEdit={id => this.updateEditForm({ open: true, userID: id })}
									rowsPerPage={10}
                                        />
                                   }
                              />
                         </CardContent>
                         <CardActions />
                    </Card>
                    <FullScreenDialog
                         open={this.state.createForm.open}
                         onClose={() => this.updateCreateForm({ open: false })}
                         heading="Vytvoření uživatele"
                    >
                         {/* <UserForm onButtonClick={createUser} buttonLabel="Vytvořit" /> */}
                    </FullScreenDialog>
                    <FullScreenDialog
                         open={this.state.editForm.open}
                         onClose={() => {
                              this.updateEditForm({ open: false });
                              resetUserForm();
                         }}
                         heading="Editace uživatele"
                    >
                         {/* <UserForm onButtonClick={() => updateUser(this.state.editForm.userID)} buttonLabel="Uložit" /> */}
                    </FullScreenDialog>
               </div>
          );
     }
}

const _mapStateToProps = state => ({
     groups: getGroups(state),
     users: getUsers(state),
});

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               fetchAllUsers: usersActions.fetchAll,
               updateUser: usersActions.update,
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
