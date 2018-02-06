import React from 'react'

const PointerList = ({data, click}) => {
  let seen = []

  const pointers = Object.keys(data).map((key) => {
    if (seen.indexOf(data[key]) === -1) {
      seen.push(data[key])
      return(<li className="App-Pointer" data-id={key} onClick={click} key={key}>{data[key]}</li>)
    }

    return [];
  })

  return (
    <ul className="App-Pointers">{pointers}</ul>
  )
};

export default PointerList
