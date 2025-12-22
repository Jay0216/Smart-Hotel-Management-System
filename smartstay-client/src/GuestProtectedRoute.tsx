import React, { type JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../src/redux/store';
import { isTokenExpired } from '../src/hepler/auth';
import { guestLogout } from '../src/redux/guestSlice';

interface Props {
  children: JSX.Element;
}

const GuestProtectedRoute: React.FC<Props> = ({ children }) => {

  const dispatch = useDispatch();
  //dispatch(guestLogout());
  const { currentGuest, token } = useSelector((state: RootState) => state.guest);

  // Auto-logout if token is expired
  if (token && isTokenExpired(token)) {
    dispatch(guestLogout());
    return <Navigate to="/guestauth" replace />;
  }

  // Redirect if not logged in or role mismatch
  if (!token || !currentGuest || currentGuest.role !== 'guest') {
    return <Navigate to="/guestauth" replace />;
  }

  return children;
};

export default GuestProtectedRoute;
