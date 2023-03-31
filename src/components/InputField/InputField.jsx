import React from 'react';
import styles from './InputField.module.css';

function InputField({id, labelText, type, onChange, placeholder, value}) {
    return (
        <>
            <label htmlFor={id} hidden> {labelText} </label>
            <input id={id} className={styles.field}
                type={type} onChange={onChange} placeholder={placeholder}
                value={value}
            />
        </>
    )
}

export default InputField