import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CategoryService from "../../../services/categoryService";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import './CategoriesTable.scss';
import NewCategoryModal from "./newCategoryModal";

const CategoriesTable = () => {
    const categoryService = new CategoryService();
    const [Categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data.content);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategoriesByName = async (name) => {
        try {
            const result = await categoryService.getByName(name);
            setCategories(result.content);
        } catch (error) {
            console.error("Error fetching categories by name:", error);
        }
    };

    const onRowEditComplete = async (e) => {
        let _categories = [...Categories];
        _categories[e.index] = e.newData;
        setCategories(_categories);
        categoryService.update(e.newData);
    };

    const handleDelete = async (id) => {
        try {
            await categoryService.delete(id);
            setCategories(Categories.filter(category => category.id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleCategoryAdded = (newCategory) => {
        setCategories([...Categories, newCategory]);
    };

    const nameEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    const descriptionEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    const deleteButton = (rowData) => {
        return (
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => handleDelete(rowData.id)} />
        )
    }

    const header = () => {
        return (
            <div id="category-table">
                <div>
                    <Button label="Adicionar Categoria" icon="pi pi-plus" onClick={() => setShowModal(true)} />
                </div>
                <InputText placeholder="Buscar Categoria" onChange={(e) => fetchCategoriesByName(e.target.value)} />
            </div>
        );
    }

    return (
        <>
            <DataTable
                value={Categories}
                editMode="row"
                dataKey="id"
                onRowEditComplete={onRowEditComplete}
                paginator rows={10}
                header={header}
                resizableColumns columnResizeMode='fit'
            >
                <Column field="id" header="ID" style={{ width: '5%' }}></Column>
                <Column field="name" header="Nome" editor={nameEditor} style={{ width: '20%' }}></Column>
                <Column field="observation" header="Observações" editor={descriptionEditor}></Column>
                <Column rowEditor header="Editar" bodyStyle={{ textAlign: 'left' }} style={{ width: '10%' }}></Column>
                <Column body={deleteButton} header="Excluir" bodyStyle={{ textAlign: 'left' }} style={{ width: '10%' }}></Column>
            </DataTable>

            <NewCategoryModal visible={showModal} onHide={() => setShowModal(false)} onCategoryAdded={handleCategoryAdded} />
        </>
    );
};

export default CategoriesTable;