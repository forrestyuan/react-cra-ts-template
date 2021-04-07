import React from 'react'

export function createStore<T>(
  ClassFactory: new () => T,
): [() => T, T, React.Context<T>] {
  const store = new ClassFactory()
  const context = React.createContext(store)
  const useStore = () => React.useContext(context)
  return [useStore, store, context]
}
