import React from 'react';

function TableBody(props) {
    const rows = props.rbtData.map((row, index) => {
        return (
          <tr key={index}>
            <tr>
              <th>Rose</th>
              <td>{row.rose}</td>
            </tr>
            <tr>
              <th>Bud</th>
              <td>{row.bud}</td>
            </tr>
            <tr>
              <th>Thorn</th>
              <td>{row.thorn}</td>
            </tr>
          </tr>
        );
      });
      return (
          <tbody>
             {rows}
          </tbody>
       );
  }

function Table(props) { 
    return (
      <table>
        <TableBody rbtData={props.rbtData} />
      </table>
    );
 }

export default Table;
