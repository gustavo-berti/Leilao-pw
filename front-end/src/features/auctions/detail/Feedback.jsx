import { useState, useEffect, memo } from "react";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Rating } from "primereact/rating";
import { DataView } from "primereact/dataview";
import FeedbackService from "../../../services/feedbackService";
import BidService from "../../../services/bidService";
import CreateFeedback from "./CreateFeedback";

const Feedback = ({ auctionID, targetPersonEmail, userEmail }) => {
    const bidService = new BidService();
    const feedbackService = new FeedbackService();
    const [hasBidded, setHasBidded] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const loadData = async () => {
        if (!targetPersonEmail) return;
        try {
            setLoading(true);
            const feedbackResponse = await feedbackService.findByTargetPersonEmail(targetPersonEmail);
            setFeedbacks(feedbackResponse || []);
            if (userEmail) {
                const hasBiddedResponse = await bidService.personHasBidded(auctionID, userEmail);
                setHasBidded(hasBiddedResponse);
            } else {
                setHasBidded(false);
            }
        } catch (error) {
            console.error('Erro ao carregar dados de feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const feedbackTemplate = (feedback) => {
        return (
            <div className="feedback">
                <div className="space-between">
                    <span>
                        {feedback.personName || 'Anônimo'}
                    </span>
                    <Rating value={feedback.rating} readOnly cancel={false} stars={5} />
                </div>
                <div>
                    <i className="pi pi-comment"></i>
                    {feedback.comment}
                </div>
                <small>
                    {new Date(feedback.dateHour).toLocaleDateString('pt-BR')}
                </small>
            </div>
        );
    }

    useEffect(() => {
        loadData();
    }, [auctionID, userEmail, targetPersonEmail]);

    return (
        <>
            {hasBidded ? (
                <div className="space-between">
                    <h3>Feedbacks</h3>
                    <Button label="Deixar Feedback" onClick={() => {
                        setShowModal(true);
                    }} />
                </div>
            ) : (
                <div className="space-between">
                    <h3>Feedbacks</h3>
                    {userEmail && <p>Você ainda não deu um lance neste leilão.</p>}
                </div>
            )}
            {loading ? (
                <ProgressSpinner />
            ) : (
                <>
                    {feedbacks.length > 0 ? (
                        <DataView value={feedbacks} itemTemplate={feedbackTemplate} />
                    ) : (
                        <p>Este vendedor ainda não possui avaliações.</p>
                    )}
                </>
            )}
            <CreateFeedback
                visible={showModal}
                onHide={() => setShowModal(false)}
                targetPersonEmail={targetPersonEmail}
                userEmail={userEmail}
                onFeedbackCreated={loadData}
            />
        </>
    );
}

export default memo(Feedback);