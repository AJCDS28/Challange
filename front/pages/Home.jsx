
import styles from './Home.module.css'
import DynamicTable from '../components/layout/DynamicTable'
import { useState, useEffect } from 'react'

function Home() {
    const [productsCar, setProductsCar] = useState([])
    const [products, setProducts] = useState([])
    const [selectedProduct, setSelectedProduct] = useState('');
    const [productName, setProductName] = useState('');
    const [amount, setAmount] = useState('');
    const [tax, setTax] = useState('');
    const [unitPrice, setUnitPrice] = useState('');

    const columns = [
        { id: 1, name: 'Product' },
        { id: 2, name: 'Amount' },
        { id: 3, name: 'Price' },
        { id: 4, name: 'Total' },
        { id: 5, name: 'Delete' }
    ]

    const handleDelete = async (e) => {
        e.preventDefault();
        alert(e.target.value);
        const response = confirm("Deseja excluir mesmo o produto ?");
        if (response) {
            const formData = new FormData();
            formData.append('action', 'deleteProductCar');
            formData.append('code', e.target.value);
            try {
                const deleteResponse = await fetch('http://localhost:80/routers/routerHome.php', {
                    method: 'POST',
                    body: formData
                });
                console.log(await deleteResponse.json());
                if (!deleteResponse.ok) {
                    throw new Error('Erro ao ler dados do servidor');
                }
                fetchDataProductsCar();
                alert("Dados excluidos com sucesso");
            } catch (error) {
                console.error(error);
                alert("Erro ao carregar dados");
                return false;
            }
        }

    };
    const data = [];
    for (let index = 0; index < productsCar.length; index++) {
        data[index] = {
            name: productsCar[index].name_product,
            amount: productsCar[index].amount,
            unitPrice: productsCar[index].price,
            total: productsCar[index].amount * productsCar[index].price,
            delete: <button onClick={handleDelete} value={productsCar[index].code}>X</button>
        }
    }

    function handleProductChange(event) {
        const selectedIndex = event.target.value;
        setSelectedProduct(selectedIndex);
        for (let index = 0; index < products.length; index++) {
            if (products[index]['code_product'] == selectedIndex) {
                setTax(products[index]['tax']);
                setUnitPrice(products[index]['price'])
                setProductName(products[index]['product_name'])
            }
        }

    }

    useEffect(() => {
        fetchDataProducts();
        fetchDataProductsCar();
    }, []);

    async function fetchDataProducts() {
        const response = await fetch('http://localhost:80/routers/routerProducts.php');
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const data = await response.json();
        setProducts(data);
    }
    async function fetchDataProductsCar() {
        const response = await fetch('http://localhost:80/routers/routerHome.php');
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const data = await response.json();
        setProductsCar(data);
    }
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const datas = {
            selectedProduct,
            amount,
            unitPrice,
            tax
        }
        const formData = new FormData();
        formData.append('Products', productName);
        formData.append('code_product', parseInt(datas.selectedProduct));
        formData.append('amountProduct', parseInt(datas.amount));
        formData.append('priceProduct', parseFloat(datas.unitPrice));
        formData.append('taxProduct', parseFloat(datas.tax));
        formData.append('action', 'addProductCar');

        const response = await fetch('http://localhost:80/routers/routerHome.php', {
            method: 'POST',
            mode: 'cors',
            body: formData
        });
        console.log(response);
        if (response.ok) {
            setAmount('');
            setSelectedProduct('');
            setProductName('');
            setTax('');
            setUnitPrice('');
            alert('Produto inserido no carrinho com sucesso!');
            fetchDataProductsCar();
        } else {
            alert('Erro ao adicionar produto ao carrinho.');
        }
    };
    async function deleteProductCar(code) {
        const dataForm = new FormData(form);
        dataForm.append('action', 'deleteProductCar');
        dataForm.append('code', code);
        const response = await fetch('http://localhost:80/routers/routerHome.php', {
            method: 'POST',
            mode: 'cors',
            body: dataForm
        });
        if (response.ok) {
            fetchDataProductsCar();
        } else {
            console.error('Erro ao excluir produto.');
        }
    }

    async function handleCancelBuy(e) {
        e.preventDefault()
        if (productsCar != 0) {
            const response = confirm('Deseja mesmo cancelar a compra?');
            if (response) {
                for (let index = 0; index < productsCar.length; index++) {
                    deleteProductCar(productsCar[index]['code']);
                }
            }
        }
        else {
            alert("Carrinho vazio");
        }
    }
    async function handleFinishBuy(e) {
        e.preventDefault();
        const response = confirm('Deseja mesmo finalizar a compra?');
        if (response) {
            let product;
            var arrayProductsCar = new Array();
            let verifyBuy;
            for (let index = 0; index < productsCar.length; index++) {
                product = {
                    code: productsCar[index].code,
                    code_product: productsCar[index].product_code,
                    amount: productsCar[index].amount,
                    price: productsCar[index].price,
                    tax: productsCar[index].tax
                }
                verifyBuy = await updateStock(productsCar[index].product_code, productsCar[index].amount);
                if (!verifyBuy) {
                    break;
                }
                arrayProductsCar.push(product);

            }
            if(verifyBuy){
                const dataForm = new FormData();
                dataForm.append('action', 'finishBuy');
                const data = await fetch('http://localhost:80/routers/routerHome.php', {
                    method: 'POST',
                    mode: 'cors',
                    body: dataForm
                })
                const datas = await data.json();
                if (data.ok) {
                        for (let index = 0; index < arrayProductsCar.length; index++) {
                            await deleteProductCar(arrayProductsCar[index].code);
                    }
                }
            }
        }

        }
        async function updateStock(code_product, newAmount) {
            alert(code_product);
            const productToUpdate = productsCar.find(product => product.product_code === code_product);
            console.log(productToUpdate['name_product']);
            try{
                if (productToUpdate) {
                    for (let index = 0; index < products.length; index++) {
                        if (productToUpdate['name_product'] == products[index]['product_name']) {
                            var amount = products[index]['amount'];
                        }
                    }
                    const currentAmount = parseInt(amount);
                    const newAmounts = parseInt(newAmount);
                    const updateAmount = currentAmount - newAmounts;
                    if(updateAmount >= 0){
                        const formData = new FormData();
                        formData.append('code_product', code_product);
                        formData.append('newAmount', updateAmount);
                        formData.append('action', 'updateStock');
                        const response = await fetch('http://localhost:80/routers/routerProducts.php', {
                            method: 'POST',
                            mode: 'cors',
                            body: formData
                        });
                        const data = await response.json();
                        console.log(data);
                        if (!response.ok) {
                            console.error('Erro ao atualizar o estoque do produto.');
                        }
                        return true;
                    }else{
                        alert("Produto "+ productToUpdate.name_product+" indisponivel no estoque");
                        return false;
                    }
                    
                } else {
                    console.error('Produto não encontrado.');
                    return false;
                }
            }catch(error){
                console.log(error);
                return false;
            }
        }

        return (
            <>
                <main className={styles.main}>
                    <article className={styles.menu_product}>
                        <form id="form" onSubmit={handleFormSubmit}>
                            <select name="Products" value={selectedProduct} className={styles.option} onChange={handleProductChange} required>
                                <option value="" >Select Product</option>
                                {products.map((product) => (
                                    <option key={product.code_product} value={product.code_product}>
                                        {product.product_name}
                                    </option>
                                ))}
                            </select>
                            <span className={styles.span}>
                                <input
                                    type="number"
                                    name="amountProduct"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    step="0" min="1"
                                    className="options"
                                    placeholder="Amount"
                                    required />
                                <input
                                    type="text"
                                    value={tax}
                                    name="taxProduct"
                                    className="options"
                                    placeholder=" Tax"
                                    readOnly
                                    required />
                                <input
                                    type="text"
                                    value={unitPrice}
                                    name="priceProduct"
                                    className="options"
                                    placeholder=" Price"
                                    readOnly
                                    required />
                            </span>
                            <button className={styles.button_add} type="submit">AddProduct</button>
                        </form>
                    </article>

                    <article className={styles.menu_buy}>

                        <DynamicTable columns={columns} data={data} />

                        <article className={styles.buttons_bottom}>
                            <section className={styles.buttonsDiv">
                                <div className="buttonTax">
                                    <p className="tax"></p>
                                </div>
                                <div className="buttonTotal">
                                    <p className="total"></p>
                                </div>
                            </section>
                            <button id="buttonCancel" className="buttonCancel" onClick={handleCancelBuy}>Cancel</button>
                            <button id="buttonFinish" className="buttonFinish" onClick={handleFinishBuy}>Finish</button>
                        </article>
                    </article>
                </main>
            </>

        )

    }

    export default Home;