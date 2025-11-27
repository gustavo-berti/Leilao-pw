import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import LongContainer from "../../../components/longContainer/longContainer"
import CategoryService from "../../../services/categoryService";
import AuctionService from "../../../services/auctionService";
import './createAuction.scss';

const createAuction = () => {
  const categoryService = new CategoryService();
  const auctionService = new AuctionService();
  const navigate = new useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
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

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveAuction = async () => {
    setIsLoading(true);
    try {
      const response = await auctionService.insert(formData, user.email);
      console.log('Leilão criado com sucesso:', response);
      navigate('/leiloes');
    } catch (error) {
      const errorObj = {};
      error.response.data.details.forEach(detail => {
        const [field, message] = detail.split(': ');
        errorObj[field] = message;
      });
      setErrors(errorObj)
      console.error('Erro ao criar leilão:', error);
      console.log(errors);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <LongContainer>
        <h2>Criar Leilão</h2>
        <div className="form">
          <div className="row">
            <div className="p-field select-place">
              <InputText
                name="title"
                value={formData.title}
                onChange={(e) => handleChange(e)}
                placeholder="Título"
              />
              {errors.title && <small className="p-error">{errors.title}</small>}
            </div>
            <div className="p-field">
              <InputNumber
                value={formData.minimalBid}
                onValueChange={(e) => handleNumberChange('minimalBid', e.value)}
                placeholder="Lance Mínimo"
                mode="currency"
                currency="BRL"
                locale="pt-br"
                min={0}
              />
              {errors.minimalBid && <small className="p-error">{errors.minimalBid}</small>}
            </div>
            <div className="p-field">
              <Calendar
                name="dateHourEnd"
                onChange={(e) => handleChange(e)}
                showTime
                value={formData.dateHourEnd}
                placeholder="Data e Hora de Término"
                dateFormat="dd/mm/yy"
              />
              {errors.dateHourEnd && <small className="p-error">{errors.dateHourEnd}</small>}
            </div>
            <div className="p-field">
              <Dropdown
                name="category"
                placeholder="Categoria"
                options={categories}
                optionLabel="name"
                value={formData.category}
                onChange={(e) => handleChange(e)}
              />
              {errors.category && <small className="p-error">{errors.category}</small>}
            </div>
          </div>
          <div className="row">
            <div className="p-field">
              <InputTextarea
                name="description"
                value={formData.description}
                onChange={(e) => handleChange(e)}
                rows={1} autoResize
                placeholder="Descrição curta"
                maxLength={200}
              />
              {errors.description && <small className="p-error">{errors.description}</small>}
            </div>
          </div>
          <div className="row">
            <div className="p-field">
              <InputTextarea
                name="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => handleChange(e)}
                rows={5} autoResize
                maxLength={500}
                placeholder="Descrição longa"
              />
              {errors.detailedDescription && <small className="p-error">{errors.detailedDescription}</small>}
            </div>
          </div>
          <Button className="p-button-success"
            onClick={() => saveAuction()}
            disabled={isLoading}
          >
            Criar Leilão
          </Button >
        </div>
      </LongContainer>
    </>
  );
}

export default createAuction;