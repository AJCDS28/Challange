import React, { useEffect, useState } from 'react'
import DynamicTable from '../components/layout/DynamicTable'
import styles from './History.module.css'
import Modal from '../components/layout/Modal';

const History = () => {
    const [ordersHistory, setOrdersHistory] = useState([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [modal, setModal] = useState(false);
    const [orderCode, setOrderCode] = useState();

    useEffect(() => {
        updateTable();
    }, []);

    const viewOrderDetails = async (code) => {
        const productsItens = await readOrdersItensHistory(code);
        setSelectedOrderDetails(productsItens);
    };

    const updateTable = async () => {
        const ordersHistoryData = await readOrdersHistory();
        setOrdersHistory(ordersHistoryData);
    };

    const readOrdersHistory = async () => {
        const response = await fetch('http://localhost:80/routers/routerHistory.php', {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    };

    const readOrdersItensHistory = async (code) => {
        const dataForm = new FormData();
        dataForm.append('action', 'readItens');
        dataForm.append('code', code);
        const response = await fetch('http://localhost:80/routers/routerHistory.php', {
            method: 'POST',
            body: dataForm
        });
        const data = await response.json();
        return data;
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const columnsHistory = [
        { id: 'code', name: 'Code' },
        { id: 'tax', name: 'Tax' },
        { id: 'total', name: 'Total' },
        { id: 'details', name: 'Details' }
    ];

    function viewModal(code){
        setOrderCode(code);
        setModal(true);
        viewOrderDetails(code);
    }
    const data = [];
    for (let index = 0; index < ordersHistory.length; index++) {
        data[index] = {
            code: ordersHistory[index].code,
            name: ordersHistory[index].tax,
            tax: ordersHistory[index].total,
            view: <button onClick={ () => viewModal(ordersHistory[index].code)} value={orderCode} >View</button>
        }
    }
    return (
        <>
            <main className={styles.main}>
            <Modal 
                    modal={modal}
                    setModal={setModal}
                    setSelectedOrderDetails={setSelectedOrderDetails}
                    selectedOrderDetails={selectedOrderDetails}
                />
                <article className={styles.menu_history}>
                    <DynamicTable
                        columns={columnsHistory}
                        data={data}
                    />
                </article>
                
                

            </main>
        </>
    );
};

export default History;

/*
 renderBodyRow={(history) => (
                            <tr key={history.code}>
                                <td>{history.code}</td>
                                <td>{formatCurrency(parseFloat(history.tax))}</td>
                                <td>{formatCurrency(parseFloat(history.total))}</td>
                                <td><button className={styles.buttonView} onClick={() => { setModal(true) }} >View</button></td>
                            </tr>
                        )}




renderBodyRow={(detail) => (
                    <tr key={detail.code_product}>
                        <td>{detail.name_product}</td>
                        <td>{detail.name_category}</td>
                        <td>{formatCurrency(parseFloat(detail.price))}</td>
                        <td>{detail.amount}</td>
                        <td>{formatCurrency(parseFloat(detail.tax))}</td>
                        <td>{formatCurrency(parseFloat(detail.amount) * parseFloat(detail.price))}</td>
                    </tr>
                )}
                        */
