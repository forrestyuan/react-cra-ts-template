import { useRef } from 'react'
import useMount from 'react-use/esm/useMount'
import useUnmount from 'react-use/esm/useUnmount'
import {
  reaction,
  IReactionPublic,
  IReactionOptions,
  IReactionDisposer,
} from 'mobx'

export const useReaction = <T>(
  expression: (r: IReactionPublic) => T,
  effect: (value: T, prevValue: T, r: IReactionPublic) => void,
  opts?: IReactionOptions,
) => {
  let disposerRef: React.MutableRefObject<IReactionDisposer | null> = useRef(
    null,
  )
  useMount(() => {
    disposerRef.current = reaction(expression, effect, opts)
  })
  useUnmount(() => {
    if (disposerRef.current) {
      disposerRef.current?.()
    }
  })
}