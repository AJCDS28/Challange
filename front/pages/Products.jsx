import Table from '../components/layout/DynamicTable'
import React, { useState, useEffect } from 'react'
import styles from '../pages/Products.module.css'

function Products() {
    const columns = [
        { id: 1, name: 'Code' },
        { id: 2, name: 'Product' },
        { id: 3, name: 'Category' },
        { id: 4, name: 'Amount' },
        { id: 5, name: 'Unit Price' },
        { id: 6, name: 'Delete' }
    ]

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [productName, setProductName] = useState('');
    const [amount, setAmount] = useState('');
    const [unitPrice, setUnitPrice] = useState('');

    const handleProductChange = (event) => {
        const selectedIndex = event.target.value;
        console.log(selectedIndex);
        setSelectedCategory(selectedIndex);
    };
    const fetchDataCategories = async () => {
        const response = await fetch('http://localhost:80/routers/routerCategories.php');
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const dataProducts = await response.json();
        setCategories(dataProducts);
    }
    useEffect(() => {
        fetchDataCategories();
        fetchDataProducts();
    }, []);

    async function fetchDataProducts() {
        const response = await fetch('http://localhost:80/routers/routerProducts.php');
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const data = await response.json();
        setProducts(data);
    }
 
    const handleDelete = async (e) => {
        e.preventDefault();
        const response = confirm(`Deseja excluir mesmo o produto ${e.target.value}?`);
        if (response) {
                const formData = new FormData();
                formData.append('action', 'deleteProduct');
                formData.append('code', e.target.value);
                try {
                const deleteResponse = await fetch('http://localhost:80/routers/routerProducts.php',{
                    method: 'POST',
                    body: formData
                });
                if (!deleteResponse.ok) {
                    throw new Error('Erro ao ler dados do servidor');
                }
                fetchDataProducts();
                alert("Dados excluidos com sucesso");
            } catch (error) {
                console.error(error);
                alert("Erro ao carregar dados");
                return false;
            }
        }

    };
    const data = [];
    for (let index = 0; index < products.length; index++) {
        data[index] = {
            code: products[index].code_product,
            name: products[index].product_name,
            category: products[index].category_name,
            amount: products[index].amount,
            unitPrice: products[index].price,
            delete: <button onClick={handleDelete} value={products[index].code_product}>X</button>
        }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const data = {
            productName,
            amount, 
            unitPrice,
            selectedCategory
        }
        console.log(data);
        const formData = new FormData();
        formData.append('productName', data.productName);
        formData.append('amountProduct', data.amount);
        formData.append('unitPrice', data.unitPrice);
        formData.append('Categoria', data.selectedCategory);
        formData.append('action', 'insertProducts');

        const response = await fetch('http://localhost:80/routers/routerProducts.php', {
            method: 'POST',
            mode: 'cors',
            body: formData
        });
        if (response.ok) {
            setProductName('');
            setAmount('');
            setUnitPrice('');
            setSelectedCategory('');
            alert('Produto inserido no carrinho com sucesso!');
            fetchDataProducts();
        } else {
            alert('Erro ao adicionar produto ao carrinho.');
        }
    };

    return (
        <>
            <main className={styles.main}>
                <article className={styles.menu_add_product}>
                    <form id="form" onSubmit={handleFormSubmit}>
                        <input
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Product Name"
                            required />
                        <span>
                            <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0" min="1" 
                            placeholder="Amount"
                            required 
                            pattern="[0-9]+$"/>

                            <input 
                            type="number"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(e.target.value)} 
                            step="0.01" min="0.01"
                            placeholder="Unit price"
                            required />

                            <select name="Categories" value={selectedCategory} onChange={handleProductChange} required>
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.code} value={category.code}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <button className={styles.button_add_product} type="submit">Add Product</button>
                    </form>
                </article>


                <article>
                   {<Table columns={columns} data={data}/>}
                </article>
            </main>
        </>

    )

}

export default Products;