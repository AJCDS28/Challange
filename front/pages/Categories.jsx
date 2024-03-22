import styles from '../pages/Categories.module.css'
import Table from '../components/layout/Table'

function Categories() {
    return(
        <main className={styles.main}>
        <article className={styles.menu_add_category}>
            <form id="form">
                <span>
                    <input type="text" name="categoryName" id="categoryName" placeholder="Category name" required />
                    <input type="number" step="0.01" min="0.01" name="taxCategory" id="taxCategory" placeholder="Tax"
                        required />
                </span>
                <button className={styles.button_add_caterory} id="addCategory" type="submit">Add Category</button>
            </form>

        </article>

        <article>
            <table className={styles.table_category}>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Category</th>
                        <th>Tax</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody class="tableAddCategory">
                </tbody>
            </table>
        </article>
    </main>

    )

}

export default Categories;