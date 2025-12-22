import React, { type JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../src/redux/store';
import { isTokenExpired } from '../src/hepler/auth';
import { adminLogout } from '../src/redux/adminSlice';

interface Props {
  children: JSX.Element;
}

const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const { currentAdmin, token } = useSelector((state: RootState) => state.admin);

  // Auto-logout if token is expired
  if (token && isTokenExpired(token)) {
    dispatch(adminLogout());
    return <Navigate to="/admin-login" replace />;
  }

  // Redirect if not logged in or role mismatch
  if (!token || !currentAdmin || currentAdmin.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
