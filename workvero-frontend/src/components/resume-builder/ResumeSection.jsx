import { useState } from "react";
import { ArrowLeft, ArrowRight } from 'lucide-react';

function ResumeSection({ title, items, emptyItem, setItems, renderTitle, renderSummary, renderForm,
    onSave, onDelete, onBack, onNext, addButtonText = "Add", }) {

    const [editing, setEditing] = useState(null);

    const handleAdd = () => {

        setItems(prev => [
            ...prev,
            { ...emptyItem }
        ]);

        setEditing(items.length);

    };

    const handleSave = async (index) => {

        await onSave(items[index], index);

        setEditing(null);

    };

    const handleDelete = async (index) => {

        await onDelete(items[index], index);

        setItems(prev =>
            prev.filter((_, i) => i !== index)
        );

        if (editing === index) {
            setEditing(null);
        }

    };
    const handleCancel = () => {

        const item = items[editing];

        const ignoreFields = [
            "id",
            "createdAt",
            "updatedAt",
            "currentlyStudying",
        ];

        const hasValue = Object.entries(item).some(([key, value]) => {

            if (ignoreFields.includes(key)) {
                return false;
            }

            if (typeof value === "string") {
                return value.trim() !== "";
            }

            return value !== null && value !== undefined;

        });

        if (!hasValue) {

            setItems(prev =>
                prev.filter((_, i) => i !== editing)
            );

        }

        setEditing(null);

    };

    return (

        <div className="edit_candidate_basic">
            <div className="form_card resume_section">

                <div className="resume_section_header">

                    <h3>{title} <button type="button" className="add_section" onClick={handleAdd}>
                        + {addButtonText}
                    </button></h3>



                </div>

                {items.map((item, index) => (

                    <div className="resume_item" key={item.id || index}>

                        {editing === index ? (

                            <>
                                <div className="resume_item_header">
                                    <h4>{title} {index + 1}</h4>

                                </div>
                                {renderForm({ item, index, items, setItems })}
                                <div className="resume_footer form_fields">
                                    <button type="button" className="submit-btn" onClick={() => handleSave(index)}>Save</button>

                                    <button type="button" className="outline-btn" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                </div>



                            </>

                        ) : (
                            <>
                                <div className="resume_item_header">
                                    <h4>{title} {index + 1}</h4>
                                    <div className="resume_item_actions">
                                        <button type="button" className="icon-btn" onClick={() => setEditing(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                                <path d="M5 4.99988C5 5.26509 4.89464 5.51945 4.70711 5.70698C4.51957 5.89452 4.26522 5.99988 4 5.99988H3C2.73478 5.99988 2.48043 6.10523 2.29289 6.29277C2.10536 6.48031 2 6.73466 2 6.99988V15.9999C2 16.2651 2.10536 16.5194 2.29289 16.707C2.48043 16.8945 2.73478 16.9999 3 16.9999H12C12.2652 16.9999 12.5196 16.8945 12.7071 16.707C12.8946 16.5194 13 16.2651 13 15.9999V14.9999C13 14.7347 13.1054 14.4803 13.2929 14.2928C13.4804 14.1052 13.7348 13.9999 14 13.9999C14.2652 13.9999 14.5196 14.1052 14.7071 14.2928C14.8946 14.4803 15 14.7347 15 14.9999V15.9999C15 16.7955 14.6839 17.5586 14.1213 18.1212C13.5587 18.6838 12.7956 18.9999 12 18.9999H3C2.20435 18.9999 1.44129 18.6838 0.87868 18.1212C0.316071 17.5586 0 16.7955 0 15.9999V6.99988C0 6.20423 0.316071 5.44117 0.87868 4.87856C1.44129 4.31595 2.20435 3.99988 3 3.99988H4C4.26522 3.99988 4.51957 4.10523 4.70711 4.29277C4.89464 4.48031 5 4.73466 5 4.99988Z" fill="black" />
                                                <path d="M11.596 3.01094L15.988 7.40294L9.708 13.7059C9.61513 13.7991 9.50478 13.873 9.38329 13.9235C9.2618 13.9739 9.13155 13.9999 9 13.9999H6C5.73478 13.9999 5.48043 13.8946 5.29289 13.707C5.10536 13.5195 5 13.2652 5 12.9999V9.99994C5.00003 9.86839 5.02601 9.73814 5.07646 9.61665C5.12691 9.49515 5.20083 9.38481 5.294 9.29194L11.596 3.01094ZM18.092 0.907938C18.6435 1.45909 18.9669 2.19801 18.9975 2.97713C19.0281 3.75625 18.7636 4.51824 18.257 5.11094L18.093 5.29094L17.4 5.98494L13.013 1.59794L13.708 0.907938C14.2894 0.326594 15.0778 0 15.9 0C16.7222 0 17.5106 0.326594 18.092 0.907938Z" fill="black" />
                                            </svg>
                                        </button>

                                        <button type="button" className="icon-btn delete" onClick={() => handleDelete(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                                <path d="M3 18C2.45 18 1.97934 17.8043 1.588 17.413C1.19667 17.0217 1.00067 16.5507 1 16V3C0.71667 3 0.479337 2.904 0.288004 2.712C0.0966702 2.52 0.000670115 2.28267 3.44827e-06 2C-0.000663218 1.71733 0.0953369 1.48 0.288004 1.288C0.48067 1.096 0.718003 1 1 1H5C5 0.716667 5.096 0.479333 5.288 0.288C5.48 0.0966668 5.71734 0.000666667 6 0H10C10.2833 0 10.521 0.0960001 10.713 0.288C10.905 0.48 11.0007 0.717333 11 1H15C15.2833 1 15.521 1.096 15.713 1.288C15.905 1.48 16.0007 1.71733 16 2C15.9993 2.28267 15.9033 2.52033 15.712 2.713C15.5207 2.90567 15.2833 3.00133 15 3V16C15 16.55 14.8043 17.021 14.413 17.413C14.0217 17.805 13.5507 18.0007 13 18H3ZM13 3H3V16H13V3ZM6.713 13.713C6.90434 13.521 7 13.2833 7 13V6C7 5.71667 6.904 5.47933 6.712 5.288C6.52 5.09667 6.28267 5.00067 6 5C5.71734 4.99933 5.48 5.09533 5.288 5.288C5.096 5.48067 5 5.718 5 6V13C5 13.2833 5.096 13.521 5.288 13.713C5.48 13.905 5.71734 14.0007 6 14C6.28267 13.9993 6.52034 13.9043 6.713 13.713ZM10.713 13.712C10.9043 13.5213 11 13.284 11 13V6C11 5.71667 10.904 5.47933 10.712 5.288C10.52 5.09667 10.2827 5.00067 10 5C9.71734 4.99933 9.48 5.09533 9.288 5.288C9.096 5.48067 9 5.718 9 6V13C9 13.2833 9.096 13.521 9.288 13.713C9.48 13.905 9.71734 14.0007 10 14C10.2827 13.9993 10.5203 13.9033 10.713 13.712Z" fill="black" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="resume_item_info">


                                    {renderTitle(item) && (<h4>{renderTitle(item)}</h4>)}
                                    {renderSummary(item) && (<div className="resume_item_summary">{renderSummary(item)}</div>)}

                                </div>

                            </>


                        )}

                    </div>

                ))}
                {editing === null && <div className="resume_footer form_fields">

                    {onBack && (<button type="button" className="outline-btn tab_action_arrow back" onClick={onBack}><ArrowLeft /></button>)}

                    {onNext && (<button type="button" className="submit-btn tab_action_arrow" onClick={onNext}><ArrowRight /></button>)}

                </div>}


            </div>
        </div>

    );

}

export default ResumeSection;