import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import LongContainer from "../../components/longContainer/longContainer";
import './notfound.scss';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <>
            <LongContainer>
                <h1 className="notfound-title">404</h1>
                <h2 className="notfound-subtitle">Página Não Encontrada</h2>
                <p className="notfound-message">
                    Desculpe, a página que você está procurando não existe ou foi movida.
                </p>
                <div className="notfound-buttons">
                    <Button
                        label="Voltar"
                        icon="pi pi-arrow-left"
                        onClick={() => navigate(-1)}
                        className="p-button-secondary"
                    />
                    <Button
                        label="Ir para Home"
                        icon="pi pi-home"
                        onClick={() => navigate('/')}
                    />
                </div>
            </LongContainer>
        </>
    );
}

export default NotFound;