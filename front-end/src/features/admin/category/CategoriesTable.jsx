import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CategoryService from "../../../services/categoryService";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import './CategoriesTable.scss';

const CategoriesTable = () => {
    const categoryService = new CategoryService();
    const [Categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', observation: '' });

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

    const handleAddCategory = async () => {
        <Modal>
            <h2>Adicionar Categoria</h2>
            <InputText
                placeholder="Nome da Categoria"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <InputText
                placeholder="Observações"
                value={newCategory.observation}
                onChange={(e) => setNewCategory({ ...newCategory, observation: e.target.value })}
            />
            <Button label="Adicionar" icon="pi pi-plus" onClick={async () => {
                if (!newCategory.name) return;
                try {
                    const result = await categoryService.insert(newCategory);
                    setCategories([...Categories, result]);
                    setNewCategory({ name: '', observation: '' });
                } catch (error) {
                    console.error("Error adding category:", error);
                }
            }} />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setNewCategory({ name: '', observation: '' })} />
        </Modal>
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
                    <Button label="Adicionar Categoria" icon="pi pi-plus" onClick={handleAddCategory} />
                </div>
                <InputText placeholder="Buscar Categoria" />
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
        </>
    );
};

export default CategoriesTable;