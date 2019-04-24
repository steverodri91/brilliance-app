import React from 'react'
import numeral from 'numeral'
import { description, contents } from './Helpers'

export default function Show(props){
  const { line } = props
  const c = contents(line.item)
  return (
    <tr key={line.id} className="Line">
      <td className="Invoice--cell Line--quantity"><p>{line.quantity}</p></td>
      <td className="Invoice--cell Line--item">
        <div className="Line--item-description"><p>{description(line.item)}</p></div>
        {c? <div className="Line--item-contents">{c}</div> : null}
      </td>
      <td className="Invoice--cell Line--price">{line.price > 0? numeral(line.price).format('$0,0.00') : null }</td>
    </tr>
  )
}
