import type {TypedUseSelectorHook} from 'react-redux';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from "../../index";

// W aplikacji należy używać useAppDispatch zamiast useDispatch, oraz useAppSelector zamiast useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
