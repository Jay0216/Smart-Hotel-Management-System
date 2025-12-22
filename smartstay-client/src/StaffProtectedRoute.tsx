import React, { type JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../src/redux/store';
import { isTokenExpired } from '../src/hepler/auth';
import { staffLogout } from '../src/redux/staffSlice';

interface Props {
  children: JSX.Element;
}

const StaffProtectedRoute: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  //dispatch(staffLogout());
  const { currentStaff, token } = useSelector((state: RootState) => state.staff);

  // Auto-logout if token expired
  if (token && isTokenExpired(token)) {
    dispatch(staffLogout());
    return <Navigate to="/stafflogin" replace />;
  }

  if (!token || !currentStaff || currentStaff.role !== 'staff') {
    return <Navigate to="/stafflogin" replace />;
  }

  return children;
};

export default StaffProtectedRoute;


