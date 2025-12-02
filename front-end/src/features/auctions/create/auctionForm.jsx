import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import LongContainer from "../../../components/longContainer/longContainer"
import CategoryService from "../../../services/categoryService";
import AuctionService from "../../../services/auctionService";
import ImageService from "../../../services/imageService";
import './auctionForm.scss';

const AuctionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const categoryService = new CategoryService();
  const auctionService = new AuctionService();
  const imageService = new ImageService();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    minimalBid: '',
    dateHourEnd: '',
    category: null,
  });

  useEffect(() => {
    fetchCategories();
    if (isEditMode) {
      fetchAuctionData(id);
    }
  }, []);

  const fetchCategories = async () => {
    const data = await categoryService.getAll();
    setCategories(data.content);
  }

  const fetchAuctionData = async (auctionId) => {
    setIsLoading(true);
    try {
      const data = await auctionService.findById(auctionId);
      setFormData({ ...data, dateHourEnd: new Date(data.dateHourEnd), category: data.category });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTimeout(() => {
          navigate('/404', { replace: true });
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    setImages(e.files);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      let response;
      if (isEditMode) {
        formData.id = id;
        response = await auctionService.update(formData);
      } else {
        response = await auctionService.insert(formData, user.email);
      }
      if (images.length > 0) {
        const formDataImages = new FormData();
        images.forEach((image) => {
          formDataImages.append('images', image);
        });
        const auctionIdTarget = isEditMode ? id : response.id;
        await imageService.uploadImages(auctionIdTarget, formDataImages);
      }

      navigate('/leiloes');
    } catch (error) {
      const errorObj = {};
      error.response.data.details.forEach(detail => {
        const [field, message] = detail.split(': ');
        errorObj[field] = message;
      });
      setErrors(errorObj)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <LongContainer>
        <h2>{isEditMode ? 'Editar Leilão' : 'Criar Leilão'}</h2>
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
                disabled={isEditMode}
              />
              {errors.minimalBid && <small className="p-error">{errors.minimalBid}</small>}
            </div>
            <div className="p-field">
              <InputNumber
                value={formData.incrementValue}
                onValueChange={(e) => handleNumberChange('incrementValue', e.value)}
                placeholder="Valor do Incremento"
                mode="currency"
                currency="BRL"
                locale="pt-br"
                min={0}
              />
              {errors.incrementValue && <small className="p-error">{errors.incrementValue}</small>}
            </div>
            <div className="p-field">
              <Calendar
                name="dateHourEnd"
                onChange={(e) => handleChange(e)}
                showTime
                value={formData.dateHourEnd}
                placeholder="Término do Leilão"
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
          <div className="row">
            <FileUpload
              name="images[]" multiple
              accept="image/*"
              maxFileSize={1000000}
              auto={false}
              customUpload
              onSelect={handleFileSelect}
              emptyTemplate={
                <div className="drag-drop">
                  <i className="pi pi-image"></i>
                  {isEditMode && <p>Adicionar novas imagens (imagens antigas serão mantidas):</p>}
                  <span> Arraste e solte as imagens aqui </span>
                </div>
              }
            />
            {errors.images && <small className="p-error">{errors.images}</small>}
          </div>
          <div className="">
            <Button className="p-button-success"
              onClick={() => handleSubmit()}
              disabled={isLoading}
              loading={isLoading}
              label={isEditMode ? "Salvar Alterações" : "Criar Leilão"}
            />
            <Button className="p-button-danger"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              label="Cancelar"
            />
          </div>
        </div>
      </LongContainer>
    </>
  );
}

export default AuctionForm;