import React from 'react';
import DebtForm from '../../components/debt/DebtForm';

const CreatePage = () => {
  return (
    <div className="create-debt-page">
      <h2>새로운 부채 등록</h2>
      <DebtForm />
    </div>
  );
};

export default CreatePage;