import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import DebtList from '../../components/debt/DebtList';
import { fetchAllDebts } from '../../slices/debtSlice';

const ListPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllDebts());
  }, [dispatch]);

  return (
    <div className="debt-list-page">
      <DebtList />
    </div>
  );
};

export default ListPage;