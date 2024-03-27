import React from 'react';

const DeleteButton = ({ url, code, fetchData }) => {

  const handleDelete = async () => {
    try {
        const formData = new FormData();
        formData.append('action', 'delete')
        console.log(url);
        formData.append('code', code)
      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Dados excluidos com sucesso");
        fetchData;
      } else {
        console.error('Erro ao excluir:', data.message);
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  return (
    <button onClick={handleDelete}>Excluir</button>
  );
};

export default DeleteButton;
