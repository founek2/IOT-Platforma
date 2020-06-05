import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/CloudUpload'
import { withStyles } from '@material-ui/core/styles'
import fieldStyle from './styles'

import { errorLog } from '../../Logger'
import MyFile from '../../dto/MyFile'

const styles = theme => ({
     root: {
          display: 'inline-flex'
     },
     button: {
          marginTop: theme.spacing(1),
          marginLeft: theme.spacing(1)
     },
     textField: fieldStyle(theme).textField
})

class FileLoader extends Component {
     handleChange = e => {
          const { onChange } = this.props
          e.preventDefault()
          const { files } = e.target
          if (files.length === 0) {
          } else if (files.length === 1) {
               const localImageUrl = window.URL.createObjectURL(files[0])

               onChange({ target: { value: new MyFile(files[0].name, localImageUrl) } })
          } else {
               errorLog("Multiple files are not currently supported");
          }
     }
     render() {
          const { label, value, className, classes, ...other } = this.props

          return (
               <div className={`${classes.textField} ${className || ""} ${classes.root}`}>
                    <TextField value={value.name} disabled label={label} fullWidth {...other} />
                    <div>
                         <Fab color="primary" aria-label="Add" size="small" className={classes.button} component="label">
                              <input type="file" style={{ display: 'none' }} onChange={this.handleChange} />
                              <AddIcon />
                         </Fab>
                    </div>
               </div>
          )
     }
}

FileLoader.defaultProps = {
     value: { name: "" }
}
export default withStyles(styles)(FileLoader)
