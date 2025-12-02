import { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import CategoryService from '../../services/categoryService';

const FilterPopup = ({ filter, setFilter, fetchAuctions }) => {
    const [categories, setCategories] = useState([]);
    const categoryService = new CategoryService();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const data = await categoryService.getAll();        
        setCategories([{ id: null, name: 'Todas' }, ...data.content]);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter(prev => ({ ...prev, [name]: value }));
    }

    return (
        <>
            <div>
                <div className="p-field select-place">
                    Título:
                    <InputText
                        name="title"
                        value={filter.title}
                        onChange={(e) => handleChange(e)}
                        placeholder="Título"
                    />
                </div>
                <div className="p-field">
                    Até:
                    <Calendar
                        name="dateHourEnd"
                        onChange={(e) => handleChange(e)}
                        showTime
                        value={filter.dateHourEnd}
                        placeholder="Término do Leilão"
                        dateFormat="dd/mm/yy"
                    />
                </div>
                <div className="p-field">
                    Categoria:
                    <Dropdown
                        name="categoryId"
                        placeholder="Categoria"
                        options={categories}
                        optionLabel="name"
                        optionValue="id"
                        value={filter.categoryId}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="p-field">
                    Status:
                    <Dropdown
                        name="status"
                        placeholder="Status"
                        options={[
                            { label: 'Todos', value: null },
                            { label: 'Aberto', value: 'OPEN' },
                            { label: 'Fechado', value: 'CLOSED' },
                            { label: 'Cancelado', value: 'CANCELED' }
                        ]}
                        optionLabel="label"
                        optionValue="value"
                        value={filter.status}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="p-field">
                    Ordenar Por:
                    <Dropdown
                        name="orderBy"
                        placeholder="Ordenar Por"
                        options={[
                            { label: 'Nenhum', value: 'id' },
                            { label: 'Título', value: 'title' },
                            { label: 'Data de Término', value: 'dateHourEnd' },
                            { label: 'Valor Atual', value: 'value' }
                        ]}
                        value={filter.orderBy}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
            </div >
        </>
    );
}

export default FilterPopup;