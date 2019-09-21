import React, { Component, useState } from 'react'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/CloudUpload'
import { withStyles } from '@material-ui/core/styles'
import fieldStyle from './styles'

import blobToBase64 from '../../utils/blobToBase64'
import { errorLog } from '../../Logger'
import MyFile from '../../dto/MyFile'
import MyFileData from '../../dto/MyFileData'

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
     // constructor(props) {
     // 	super(props);
     // 	// to reset hydrated state -> objectURL is destroyed afted document unmount
     // 	this.props.onChange({target: {value: {}}}); 
     // }

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
                    <TextField value={value.name || ''} disabled label={label} fullWidth {...other} />
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
export default withStyles(styles)(FileLoader)
