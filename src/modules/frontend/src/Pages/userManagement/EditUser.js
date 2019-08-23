import React, { useState, Component } from 'react';
import FieldConnector from 'framework-ui/src/Components/FieldConnector';
import UserForm from '../../components/UserForm'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Button from '@material-ui/core/Button'
import Loader from 'framework-ui/src/Components/Loader'
import { map, pick } from 'ramda'

import { getGroups, getUsers } from 'framework-ui/src/utils/getters'
import { getQueryID } from '../../utils/getters'
import { getAllowedGroups } from 'framework-ui/src/privileges'
import * as formsActions from 'framework-ui/src/redux/actions/formsData'

const styles = theme => ({
     card: {
          overflow: 'auto',
          margin: '0px auto',
          position: 'relative',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 470,
          marginTop: 0,

          [theme.breakpoints.down('sm')]: {
               width: '100%',
          },
          [theme.breakpoints.down('xs')]: {
               width: '100%'
          },
     },
     actions: {
          marginBottom: theme.spacing.unit * 2,
          // [theme.breakpoints.up('sm')]: {
          //      marginTop: theme.spacing.unit * 2,
          // },
          margin: 'auto',
          width: 400,
          justifyContent: 'center',

          [theme.breakpoints.down('sm')]: {
               width: '100%',
               justifyContent: 'flex-start',
               flexDirection: 'column'
          }
     },
     header: {
          paddingBottom: 0,
          paddingTop: theme.spacing.unit * 4,
          textAlign: 'center'
     },
     content: {
          [theme.breakpoints.down('sm')]: {
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center'
          }
     },
     chipArray: {
          height: 90
     }
})

class EditUser extends Component {
     constructor(props) {
          super(props)
          this.state = {
               pending: false,
          }

          this.preFillForm(this.props.user)
     }

     preFillForm = (user) => {
          const userObj = pick(['info', 'groups', 'auth'], user);
          this.props.fillEditFormAction(userObj);
     }

     setPending = b => this.setState({ pending: b })
     
     render() {
          const { classes, groups, onButtonClick } = this.props;
          const { pending } = this.state;
          const handleSave = async () => {
               this.setPending(true)
               await onButtonClick()
               this.setPending(false)
          }
          return (
               <Card className={classes.card}>
                    <CardHeader className={classes.header} title="Editace uživatele" />
                    <CardContent className={classes.content}>
                         <UserForm formName='EDIT_USER' />
                         <FieldConnector
                              deepPath="EDIT_USER.groups"
                              component="ChipArray"
                              optionsData={map(({ name, text }) => ({ value: name, label: text }), getAllowedGroups(groups))}
                              className={classes.chipArray}
                         />
                    </CardContent>
                    <CardActions className={classes.actions}>
                         <Button
                              color="primary"
                              variant="contained"
                              className={classes.button}
                              onClick={handleSave}
                              disabled={pending}
                         >
                              Uložit
                    </Button>
                         <Loader open={pending} />
                    </CardActions>
               </Card>
          )
     }
}
const _mapStateToProps = state => {
     return {
          groups: getGroups(state),
     }
}

const _mapDispatchToProps = dispatch =>
     bindActionCreators(
          {
               fillEditFormAction: formsActions.fillForm('EDIT_USER'),
          },
          dispatch
     )

export default connect(
     _mapStateToProps,
     _mapDispatchToProps
)(withStyles(styles)(EditUser))