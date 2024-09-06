import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '..';

// W aplikacji należy używać setGlobalState zamiast useDispatch, oraz getGlobalState zamiast useSelector
export const setGlobalState: () => AppDispatch = useDispatch;
export const getGlobalState: TypedUseSelectorHook<RootState> = useSelector;
