import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

//use this throughout the appinstead of plain `useDispatch`.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

//Typed version of `useSelector` — use this throughout the app instead of plain `useSelector`.
export const useAppSelector = useSelector.withTypes<RootState>();
