import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Rating } from 'primereact/rating';
import FeedbackService from '../../../services/feedbackService';

const CreateFeedback = ({ visible, onHide, targetPersonEmail, userEmail, onFeedbackCreated }) => {
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const feedbackService = new FeedbackService();

    const handleSubmit = async () => {
        if (!rating) {
            return;
        }

        setLoading(true);
        try {
            const feedbackDTO = {
                rating: rating,
                comment: comment,
                targetPersonEmail: targetPersonEmail,
                authorEmail: userEmail,
                dateHour: new Date()
            };
            await feedbackService.insert(feedbackDTO);
            setRating(null);
            setComment('');
            if (onFeedbackCreated) onFeedbackCreated();
            onHide();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const footer = (
        <div className="button-group footer">
            <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
            <Button label="Enviar Avaliação" icon="pi pi-check" onClick={handleSubmit} loading={loading} autoFocus />
        </div>
    );

    return (
        <>
            <Dialog
                header="Avaliar Vendedor"
                visible={visible}
                style={{ width: '50vw' }}
                contentStyle={{ padding: '1rem' }}
                headerStyle={{ padding: '1rem' }}
                footer={footer}
                onHide={onHide}
            >
                <div className="p-fluid">
                    <div className="p-field">
                        <label>Nota</label>
                        <Rating value={rating} onChange={(e) => setRating(e.value)} cancel={false} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="comment">Comentário</label>
                        <InputTextarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            autoResize
                            placeholder="Descreva sua experiência com este vendedor..."
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default CreateFeedback;