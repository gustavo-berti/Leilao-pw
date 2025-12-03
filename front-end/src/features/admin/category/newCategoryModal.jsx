import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import CategoryService from "../../../services/categoryService";

const NewCategoryModal = ({ visible, onHide, onCategoryAdded }) => {
    const categoryService = new CategoryService();
    const [category, setCategory] = useState({ name: '', observation: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!category.name || category.name.trim() === '') {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!category.observation || category.observation.trim() === '') {
            newErrors.observation = 'Observação é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const result = await categoryService.insert(category);
            onCategoryAdded(result);
            setCategory({ name: '', observation: '' });
            setErrors({});
            onHide();
        } catch (error) {
            console.error("Erro ao adicionar categoria:", error);
            setErrors({ general: 'Erro ao salvar categoria. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setCategory({ name: '', observation: '' });
        setErrors({});
        onHide();
    };

    const footer = (
        <div className="footer">
            <Button
                label="Cancelar"
                icon="pi pi-times"
                onClick={handleCancel}
                className="p-button-text"
                disabled={loading}
            />
            <Button
                label="Salvar"
                icon="pi pi-check"
                onClick={handleSave}
                loading={loading}
                autoFocus
            />
        </div>
    );

    return (
        <Dialog
            header="Nova Categoria"
            visible={visible}
            style={{ width: '50vw'}}
            contentStyle={{padding:'1rem'}}
            headerStyle={{padding:'1rem'}}
            footer={footer}
            onHide={handleCancel}
            modal
            draggable={false}
            resizable={false}
        >
            <div id="modal" className="p-fluid">
                <div className="field" style={{marginBottom:'15px'}}>
                    <InputText
                        value={category.name}
                        onChange={(e) => setCategory({ ...category, name: e.target.value })}
                        placeholder="Digite o nome da categoria"
                        className={errors.name ? 'p-invalid' : ''}
                        disabled={loading}
                    />
                    {errors.name && <div className="p-error">{errors.name}</div>}
                </div>
                <div className="field">
                    <InputTextarea
                        value={category.observation}
                        onChange={(e) => setCategory({ ...category, observation: e.target.value })}
                        placeholder="Digite observações sobre a categoria"
                        rows={3}
                        className={errors.name ? 'p-invalid' : ''}
                        disabled={loading}
                    />
                    {errors.observation && <div className="p-error">{errors.observation}</div>}
                </div>
            </div>
        </Dialog>
    );
};

export default NewCategoryModal;