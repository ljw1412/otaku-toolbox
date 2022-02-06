import IpcWindowAction from './windowAction'
import IpcConfigAction from './configAction'
import IpcMessageAction from './messageAction'
import IpcShellAction from './shellAction'
import IpcToolPlugin from './toolPlugin'

const IpcActions = [
  IpcWindowAction,
  IpcConfigAction,
  IpcMessageAction,
  IpcShellAction,
  IpcToolPlugin
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
