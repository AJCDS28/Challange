import React from 'react';

const DeleteButton = ({ url, code, action, onSuccess }) => {

  const handleDelete = async () => {
    const response = confirm('Deseja mesmo excluir?');
    if (response) {
      try {
        const formData = new FormData();
        formData.append('action', action)
        formData.append('code', code)
        const deleteResponse = await fetch(url, {
          method: 'POST',
          body: formData
        });
        if (deleteResponse.ok) {
          onSuccess();
        } else {
          throw new Error('Erro ao excluir categoria.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao excluir categoria.');
      }
    }
  };

  return (
    <button onClick={handleDelete}>Excluir</button>
  );
};

export default DeleteButton;
