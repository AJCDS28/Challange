import React, { useState } from 'react';


const DynamicForm = ({ fields, onSubmit,action, options }) => {
    const [formData, setFormData] = useState({});

    /*const handleChange = (e, name) => {
        setFormData({ ...formData, [name]: e.target.value, [action]: options,});
        
    };*/
    const handleChange = (e, name) => {
        const value = e.target.value;
        const selectedProduct = options.find(option => option.value === value);
        setFormData({ ...formData, [name]: value, taxProduct: selectedProduct.tax, priceProduct: selectedProduct.price, [action]: options,});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field, index) => {
                return (
                    <div key={index}>
                        {field.type === 'select' ? (
                            <select
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(e, field.name)}
                                required={field.required}
                            >
                                <option value="">{field.placeholder}</option>
                                {field.options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={formData[field.name] || ''}
                                onChange={(e) => handleChange(e, field.name)}
                                step={field.step}
                                min={field.min}
                                required={field.required}
                                readOnly={field.readOnly}
                            />
                        )}
                    </div>
                );
            })}
            <button type="submit">Submit</button>
        </form>
    );
};

export default DynamicForm;
