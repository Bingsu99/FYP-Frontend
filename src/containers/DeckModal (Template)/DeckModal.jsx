import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'flowbite-react';

function DeckModal({ isOpen, onClose, rowData }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setIsSaved(false);

        // Simulate a server request with setTimeout
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            // You can also close the modal or provide further feedback here.
        }, 2000); // Simulate a 2-second server response time
    };

    const handleModelClose = () =>{
        setIsSaving(false);
        setIsSaved(false);
        onClose()
    }

    return (
        <Modal show={isOpen} size="3xl" onClose={handleModelClose}>
            <Modal.Header>Add New Exercise</Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <p>Here are the details of the selected row:</p>
                    {rowData ? (
                        <ul>
                            {rowData.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No data available.</p>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-end">
                <Button onClick={handleModelClose}>Cancel</Button>
                {!isSaved ? (
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Spinner size="sm" />
                                <span className="pl-3">Saving...</span>
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                ) : (
                    <Button disabled>
                        Saved
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default DeckModal;
