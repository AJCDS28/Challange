import styles from '../pages/Categories.module.css'
import Table from '../components/layout/DynamicTable'
import React, { useState, useEffect } from 'react'
import DynamicForm from '../components/layout/DynamicForm'
import DeleteButton from '../components/layout/DelectButton'

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [tax, setTax] = useState('');
    const url = 'http://localhost:80/routers/routerCategories.php'
/*
    const handleDelete = async (e) => {
        e.preventDefault();
        const response = confirm(`Deseja excluir mesmo a categoria ${e.target.value}?`);
        if (response) {
                const formData = new FormData();
                formData.append('action', 'deleteCategory');
                formData.append('code', e.target.value);
                try {
                const deleteResponse = await fetch(url,{
                    method: 'POST',
                    body: formData
                });
                if (!deleteResponse.ok) {
                    throw new Error('Erro ao ler dados do servidor');
                }
                alert("Dados excluidos com sucesso");
                fetchData();
            } catch (error) {
                console.error(error);
                alert("Erro ao carregar dados");
                return false;
            }
        }

    };
    */

    const handleDeleteSuccess = () => {
        fetchData(); 
    };
    const fetchData = async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const dataProducts = await response.json();
        setCategories(dataProducts);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { id: 1, name: 'Code' },
        { id: 2, name: 'Category' },
        { id: 3, name: 'Tax' },
        { id: 4, name: 'Delete' }
    ]

    const data = categories.map(category => ({
        code: category.code,
        name: category.name,
        tax: category.tax,
        delete: <DeleteButton url={url} code={categories.code} action="deleteCategory" id={category.code} onSuccess={handleDeleteSuccess} />

    }))
    
    const handleFormSubmit = async (formData) => {
        console.log(formData)
        const dataForm = new FormData();
        dataForm.append('action', formData.action);
        dataForm.append('categoryName', formData.categoryName);
        dataForm.append('taxCategory', formData.tax);

        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: dataForm
            });
            if (response.ok) {
                setCategoryName('');
                setTax('');
                alert('Categoria adicionada com sucesso!');
                fetchData();
            } else {
                throw new Error('Erro ao adicionar categoria');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao adicionar categoria');
        }
    };

    return (
        <main className={styles.main}>
            <article className={styles.menu_add_category}>
            <DynamicForm
                    fields={[
                        { type: 'text', name: 'categoryName', placeholder: 'Category name', required: true },
                        { type: 'number', name: 'tax', placeholder: 'Tax', step: '0.01', min: '0.01', required: true }
                    ]}
                    onSubmit={handleFormSubmit}
                    action={'action'}
                    options={'addCategory'}
                />

            </article>

            <article>
                {<Table columns={columns} data={data} />}

            </article>
        </main>

    )

}

export default Categories;