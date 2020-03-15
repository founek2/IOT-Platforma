import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Root from './containers/Root'
import Router from './containers/Router'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<Root component={Router} />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// if (process.env.NODE_ENV === 'production') serviceWorker.register()
// else serviceWorker.unregister()
serviceWorker.register()
