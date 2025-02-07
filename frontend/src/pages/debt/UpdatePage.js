import React from 'react';
import { useParams } from 'react-router-dom';
import { useDebt } from '../../hooks/useDebt';
import DebtForm from '../../components/debt/DebtForm';

const UpdatePage = () => {
  const { debtId } = useParams();
  const { debt, loading, error } = useDebt(debtId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="update-debt-page">
      <h2>부채 정보 수정</h2>
      <DebtForm initialData={debt} />
    </div>
  );
};

export default UpdatePage;