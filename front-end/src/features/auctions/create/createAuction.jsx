import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import LongContainer from "../../../components/longContainer/longContainer"
import CategoryService from "../../../services/categoryService";
import './createAuction.scss';

const createAuction = () => {
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    minimalBid: '',
    dateHourEnd: '',
    category: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data.content);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const saveAuction = () => {
    // Lógica para salvar o leilão via API
  }

  return (
    <>
      <LongContainer>
        <h2>Criar Leilão</h2>
        <div className="form">
          <div className="row">
            <InputText placeholder="Título" />
            <InputText placeholder="Lance Mínimo" />
            <InputText placeholder="Data e Hora de Término" />
            <Dropdown
              name="category"
              placeholder="Categoria"
              options={categories}
              optionLabel="name"
              value={formData.category}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="row">
            <InputTextarea rows={1} autoResize placeholder="Descrição curta" maxLength={200} />
          </div>
          <div className="row">
            <InputTextarea rows={5} autoResize maxLength={500} placeholder="Descrição longa" />
          </div>
          <button className="p-button p-component p-button-success" onClick={saveAuction()}>Criar Leilão</button>
        </div>
      </LongContainer>
    </>
  );
}

export default createAuction;