import React, { type JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../src/redux/store';
import { isTokenExpired } from '../src/hepler/auth';
import { receptionistLogout } from '../src/redux/receptionSlice';

interface Props {
  children: JSX.Element;
}

const ReceptionistProtectedRoute: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const { currentReceptionist, token } = useSelector(
    (state: RootState) => state.receptionist
  );

  // Auto-logout if token expired
  if (token && isTokenExpired(token)) {
    dispatch(receptionistLogout());
    return <Navigate to="/stafflogin" replace />;
  }

  // Redirect if not logged in
  if (!token || !currentReceptionist) {
    return <Navigate to="/stafflogin" replace />;
  }

  return children;
};

export default ReceptionistProtectedRoute;
