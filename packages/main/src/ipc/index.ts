import IpcWindowAction from './windowAction'
import IpcConfigAction from './configAction'
import IpcMessageAction from './messageAction'
import IpcShellAction from './shellAction'

const IpcActions = [
  IpcWindowAction,
  IpcConfigAction,
  IpcMessageAction,
  IpcShellAction
]

function bind() {
  IpcActions.forEach(action => {
    action.bind()
  })
}

function unbind() {
  IpcActions.forEach(action => {
    action.unbind()
  })
}

export default { bind, unbind }
