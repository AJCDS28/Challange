import styles from './Table.module.css'
import React from 'react';

const DynamicTable = ({ columns, data }) => {
  

  const Row = ({record}) => {
    const keys = Object.keys(record)
    return (
    <tr key={record.code}>
      {
        keys.map(key => <td key={key}>{record[key]}</td>)
      }
    </tr>
    )
  }
  return (
    
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id}>{column.name}</th>
          ))
          
          }
          
        </tr>
      </thead>
      <tbody>  
        
        {data.map(record => <Row record={record} />)}
        
      </tbody>
    </table>
  );
};

export default DynamicTable;