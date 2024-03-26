import styles from '../pages/Categories.module.css'
import Table from '../components/layout/DynamicTable'
import React, { useState, useEffect, useCallback } from 'react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [tax, setTax] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        const response = confirm(`Deseja excluir mesmo a categoria ${e.target.value}?`);
        if (response) {
                const formData = new FormData();
                formData.append('action', 'deleteCategory');
                formData.append('code', e.target.value);
                try {
                const deleteResponse = await fetch('http://localhost:80/routers/routerCategories.php',{
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
    const fetchData = async () => {
        const response = await fetch('http://localhost:80/routers/routerCategories.php');
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

    const data = [];
    for (let index = 0; index < categories.length; index++) {
        data[index] = {
            code: categories[index].code,
            name: categories[index].name,
            tax: categories[index].tax,
            delete: <button onClick={handleDelete} value={categories[index].code}>X</button>
        }
    }
    
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = {
            categoryName,
            tax
        }
        console.log(data);
        const formData = new FormData();
        formData.append('categoryName', data.categoryName);
        formData.append('taxCategory', data.tax);
        formData.append('action', 'addCategory');

        const response = await fetch('http://localhost:80/routers/routerCategories.php', {
            method: 'POST',
            mode: 'cors',
            body: formData
        });
        if (response.ok) {
            setCategoryName('');
            setTax('');
            alert('Produto inserido no carrinho com sucesso!');
            fetchData();
        } else {
            alert('Erro ao adicionar produto ao carrinho.');
        }
    };

    return (
        <main className={styles.main}>
            <article className={styles.menu_add_category}>
                <form id="form" onSubmit={handleFormSubmit} >
                    <span>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Category name"
                            required />
                        <input type="number"
                            value={tax}
                            onChange={(e) => setTax(e.target.value)}
                            placeholder="Tax"
                            step="0.01"
                            min="0.01"
                            required />
                    </span>
                    <button className={styles.button_add_caterory} type="submit">Add Category</button>
                </form>

            </article>

            <article>
                {<Table columns={columns} data={data} />}

            </article>
        </main>

    )

}

export default Categories;