import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import CategoryService from "../../../services/categoryService";
import NewCategoryModal from "./newCategoryModal";
import './CategoriesTable.scss';

const CategoriesTable = () => {
    const categoryService = new CategoryService();
    const [Categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deletingIds, setDeletingIds] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll();
            setCategories(data.content);
            console.log(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoriesByName = async (name) => {
        setLoading(true);
        try {
            const result = await categoryService.getByName(name);
            setCategories(result.content);
        } catch (error) {
            console.error("Error fetching categories by name:", error);
        } finally {
            setLoading(false);
        }
    };

    const onRowEditComplete = async (e) => {
        let _categories = [...Categories];
        _categories[e.index] = e.newData;
        setLoading(true);
        try {
            await categoryService.update(e.newData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
        setCategories(_categories);
    };

    const handleDelete = async (id) => {
        setDeletingIds([...deletingIds, id]);
        try {
            await categoryService.delete(id);
            setCategories(Categories.filter(category => category.id !== id));
        } catch (error) {
            console.error("Error deleting category:", error);
        } finally {
            setDeletingIds(prev => prev.filter(deletingId => deletingId !== id));
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
        const isDeleting = deletingIds.includes(rowData.id);
        return (
            <Button icon="pi pi-trash" className="p-button-danger" onClick={() => confirmDialog({
                message: 'Quer deletar esta categoria?',
                header: 'Confirmação',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: "Sim",
                rejectLabel: "Não",
                accept: () => handleDelete(rowData.id)
            })} loading={isDeleting} disabled={isDeleting} />
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
                loading={loading}
                editMode="row"
                dataKey="id"
                onRowEditComplete={onRowEditComplete}
                paginator rows={10}
                header={header}
                resizableColumns columnResizeMode='fit'
                emptyMessage="Nenhuma categoria encontrada."
            >
                <Column field="id" header="ID" style={{ width: '5%' }}></Column>
                <Column field="name" header="Nome" editor={nameEditor} style={{ width: '20%' }}></Column>
                <Column field="observation" header="Observações" editor={descriptionEditor}></Column>
                <Column rowEditor header="Editar" bodyStyle={{ textAlign: 'left' }} style={{ width: '10%' }}></Column>
                <Column body={deleteButton} header="Excluir" bodyStyle={{ textAlign: 'left' }} style={{ width: '10%' }}></Column>
            </DataTable>
            <ConfirmDialog />
            <NewCategoryModal visible={showModal} onHide={() => setShowModal(false)} onCategoryAdded={handleCategoryAdded} />
        </>
    );
};

export default CategoriesTable;