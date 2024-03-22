
import styles from './Home.module.css'
import Table from '../components/layout/Table'

function Home() {
    const columnsTabel = [
        {id: 1, name: 'Product'},
        {id: 2, name: 'Amount'},
        {id: 3, name: 'Price'},
        {id: 4, name: 'Total'},
        {id: 5, name: 'Delete'}
    ]
    const rowTables = [
        {id: 7, Product: 'ss',Amount: 'dd', Price: 'rr', Total: 'r', Delete: 'X'}
    ]
    return (
        <>
            <main className={styles.main}>
                    <article className={styles.menu_product}>
                        <form id="form" action="updateProductCar.php">
                            <select name="Products" className="options" id="selectProduct" onchange="productSelect(this.value)"
                                required>
                                <option value="">Selecione o Produto</option>
                            </select>
                            <span className={styles.span}>
                                <input type="number" name="amountProduct" id="amountProduct" step="0" min="1" className="options"
                                    placeholder="Amount" required />
                                <input type="text" id="taxProduct" name="taxProduct" className="options" placeholder=" Tax" readOnly
                                    required />
                                <input type="text" id="priceProduct" name="priceProduct" className="options" placeholder=" Price"
                                    readOnly required />
                            </span>
                            <button className={styles.button_add} type="submit">AddProduct</button>
                        </form>
                    </article>

                    <article className={styles.menu_buy}>

                        <Table columnsTabel={columnsTabel} rowTables={rowTables}/>
                        
                        <form id="formBuy" className="buttons-bottom">
                            <section className="buttonsDiv">
                                <div className="buttonTax">
                                    <p className="tax"></p>
                                </div>
                                <div className="buttonTotal">
                                    <p className="total"></p>
                                </div>
                            </section>
                            <button id="buttonCancel" className="buttonCancel" >Cancel</button>
                            <button id="buttonFinish" className="buttonFinish">Finish</button>
                        </form>
                    </article>
            </main>
        </>

    )

}

export default Home;