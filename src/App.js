import React, { Component } from 'react';
import ReactTable from 'react-table'
import PointerList from './PointerList'
import './App.css';
import 'react-table/react-table.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      pointers: {}
    }

    this.socket = null
    this.columns = [{
      Header: 'Name',
      accessor: 'name',
      width: 300
    }, {
      Header: 'Offset',
      accessor: 'offset',
      width: 100
    }, {
      Header: 'Value',
      accessor: 'value'
    }]
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://192.168.2.16:1010/ue_scanner')
    this.socket.onmessage = e => this.handleMessage(e)
    this.socket.onerror = e => this.handleError(e)
  }

  componentWillUnmount() {
    this.socket.close()
  }

  handleMessage(e) {
    var data = JSON.parse(e.data)

    if (data.type === 'open_scanner') {
      this.socket.send('list')
    } else if (data.type === 'list') {
      this.setState({ pointers: data.data })
    } else if (data.type === 'scan_result') {
      this.setState({ data: data.data.props })
    }
  }

  handleError(e) {
    console.warn(e)
  }

  pointerClick(e) {
    this.requestScan(e.target.dataset.id)
  }

  analyzeValue(value) {
    const result = value.match(/[A-Z0-9]{16}/)

    if (result) {
      this.requestScan(result[0])
    }
  }

  requestScan(pointer) {
    this.socket.send(`scan ${pointer}`)
  }

  handleTdProps(state, rowInfo, column, instance) {
    return {
      onClick: (e, handleOriginal) => {
        this.analyzeValue(rowInfo.row.value)
      }
    }
  }

  render() {
    return (
      <div className="App">
        <PointerList 
          data={this.state.pointers}
          click={this.pointerClick.bind(this)} />
        <ReactTable
          data={this.state.data}
          columns={this.columns}
          defaultPageSize={100}
          getTdProps={this.handleTdProps.bind(this)}
        />
      </div>
    )
  }
}

export default App
