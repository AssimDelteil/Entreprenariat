// Store/configureStore.js

import { createStore } from 'redux';
import updateState from './Reducer/stateReducer'

export default createStore(updateState)