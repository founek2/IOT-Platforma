export default theme => ({
     textField: {
          marginLeft: theme.spacing(1),
          marginRight: theme.spacing(1),
          marginTop: theme.spacing(1),
          width: 200,
          [theme.breakpoints.down('sm')]: {
               width: `calc(90% - ${theme.spacing(2)}px)`
          }
     }
})