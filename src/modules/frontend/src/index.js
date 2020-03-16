import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Root from './containers/Root'
import Router from './containers/Router'

ReactDOM.render(<Root component={Router} />, document.getElementById('root'))
