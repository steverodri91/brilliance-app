import React, { Component } from 'react'
import Header from './Header/'
import SubHeader from './SubHeader/'
import Invoice from './Invoice'
import Summary from './Summary'
import Modal from '../../../../Modal/'
import ItemSelector from './ItemSelector/'
import Buttons from '../../../../Buttons/Buttons'
import { invoice, line, item, client } from '../../../../../services/BEP_APIcalls.js'
import { quantity, price, itemQty, itemPrice } from './Invoice/Line/Helpers'
import { clientName } from '../../../../../helpers/clientHelpers'
import axios from 'axios'
import './index.css'

export default class InvoiceDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      inv: null,
      editMode: false,
      formData: {},
      fields: {},
      searchFieldData: null
    }
    this.container = React.createRef()
    this.axiosRequestSource = axios.CancelToken.source()
    this.ajaxOptions = {
      cancelToken: this.axiosRequestSource.token,
      unauthorizedCB: this.props.signout,
      sendCount: false
    }
  }

  // --------------------------------Refs---------------------------------------

  scrollToTop = () => {
    this.container.current.scrollTop = 0
  }

  // ------------------------------Lifecycle------------------------------------

  async componentDidUpdate(prevProps, prevState){
    const { inv: prevInv, invoiceId: prevInvoiceId } = prevProps
    const { inv, invoiceId } = this.props
    if (prevInv !== inv || prevInvoiceId !== invoiceId) {
      await this.setup()
    }
  }

  async componentDidMount(){
    await this.setup()
  }

  async componentWillUnmount(){
    this.axiosRequestSource && this.axiosRequestSource.cancel()
  }

  // -------------------------Getters-and-Setters-------------------------------

  setup = async() => {
    const { isNew, evtId, evt, history, user: { accessLevel } } = this.props
    if (isNew && evtId) {
      const inv = invoice.create({ kind: 'Proposal', event_id: evtId })
      history.push(`${accessLevel}/invoices/${inv.id}`)
    } else {
      this.setInvoice()
    }
    if (evt) {
      this.setState({ fromEvent: true })
    }
  }

  setInvoice = async() => {
    const { inv, invoiceId } = this.props
    if (inv) {
      this.setState({ inv }, () => this.setLines())
    } else {
      const inv = await invoice.get(invoiceId, this.ajaxOptions)
      this.setState({ inv }, () => this.setLines())
    }
    await this.setClientName()
    await this.setSummary()
    await this.setFields()
  }

  setLines = async() => {
    const { inv, inv: { lines } } = this.state
    const updatedLines = lines.map( line => {
      if (line.quantity > 0 && line.price > 0) return line

      if (!line.quantity && !line.price) {
        return (
          {
            ...line,
            quantity: quantity(line),
            price: price(line, inv.kind)
          }
        )
      } else if (!line.quantity && line.price) {
        return (
          {
            ...line,
            quantity: quantity(line)
          }
        )
      } else if (line.quantity && !line.price) {
        return (
          {
            ...line,
            price: price(line, inv.kind)
          }
        )
      } else {
        return line
      }

    })

    this.setState(prevState => ({
      inv: {
        ...prevState.inv,
        lines: updatedLines
      },
      fields: {
        ...prevState.fields,
        lines: updatedLines
      },
      formData: {
        ...prevState.formData,
        lines_attributes: updatedLines
      }
    }), async() => {
      await this.updateSummary();
      // await this.handleSubmit()

    });
  }

  setFields = () => {
    const { inv } = this.state
    const fieldNames = [
      'kind', 'paymentStatus', 'paymentType', 'check',
      'commission', 'commissionPaid', 'subTotal', 'discount',
      'total', 'deposit', 'balance', 'refund', 'tip'
    ]
    if (!inv) {
      fieldNames.forEach( field => this.setField( field, null ))
    } else {
      fieldNames.forEach( field => inv[field]? this.setField( field, inv[field] ) : null)
    }
  }

  // ----------Summary

  setSummary = async() => {
    await this.setSubTotal()
    await this.setTotal()
    await this.setBalance()
  }

  setSubTotal = async(loop) => {
    const { inv } = this.state
    if (inv) {
      const { lines } = inv
      if (lines && lines.length) {
        const prices = lines.map(line => line.price)
        let subTotal;
        if (prices && prices.length) {
          subTotal = prices.reduce((a, b) => a + b)
        } else {
          subTotal = 0
        }
        this.setState(prevState => ({
          inv: {
            ...prevState.inv,
            subTotal
          },
          formData: {
            ...prevState.formData,
            subTotal
          }
        }), () => loop? this.setTotal(loop) : null )
      }
    } else {
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
          subTotal: 0
        },
        formData: {
          ...prevState.formData,
          subTotal: 0
        }
      }))
    }
  }

  setTotal = async(loop) => {
    const { inv } = this.state
    if (inv) {
      const { subTotal } = inv
      const total = subTotal - inv.discount
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
          total
        },
        formData: {
          ...prevState.formData,
          total
        }
      }), () => loop? this.setBalance() : null )
    } else {
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
          total: 0
        },
        formData: {
          ...prevState.formData,
          total: 0
        }
      }))
    }
  }

  setBalance = async(callBack) => {
    const { inv } = this.state
    if (inv) {
      const { total } = inv
      let balance = total - inv.deposit
      if (inv.paymentStatus === "Paid In Full") {
        balance = 0
      }
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
          balance
        },
        formData: {
          ...prevState.formData
        }
      }), () => callBack? callBack() : null )
    } else {
      this.setState(prevState => ({
        inv: {
          ...prevState.inv,
          balance: 0
        },
        formData: {
          ...prevState.formData,
          balance: 0
        }
      }))
    }
  }

  // ----------Client

  setClientName = () => {
    const { inv } = this.state
    if (inv) {
      if (inv.event) {
        if (inv.event.client) {
          const name = clientName(inv.event.client, { oneLine: true })
          this.setField('client', name)
          this.setFormData('client_id', inv.event.client.id)
        } else {
          this.setField('client', null)
        }
      }
    }
  }

  // ----------Helpers

  setField = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      }
    })
  )}

  setFieldAndForm = (name, value) => {
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      },
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }))
  }

  setFormData = (name, value) => {
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }))
  }

  setEditMode = (value) => {
    this.setState({
      editMode: value
    })
  }

  // ----------Reset

  resetFields = () => {
    this.setState({ fields: {} })
  }

  resetForm = () => {
    this.setState({
      formData: null,
    })
  }

  resetSearchFieldData = async() => {
    this.setState({
      searchFieldData: null
    })
  }

  // --------------------------------Lines--------------------------------------

  addLine = () => {
    this.setState({ showItemModal: true })
  }

  deleteLine = async(lineId) => {
    const state = {...this.state}
    let { inv, fields } = state

    await line.delete(lineId, this.ajaxOptions)
    const updatedLines = inv.lines.filter(line => line.id !== lineId)
    inv.lines = updatedLines
    fields.lines = updatedLines

    this.setState({ inv, fields })
  }

  // --------------------------------Items--------------------------------------

  addItem = async(data, category) => {
    const state = {...this.state}
    let { inv } = state
    let invoiceType = "Proposal"
    if (inv) invoiceType = inv.kind

    let lineData = {}

    switch (category) {

      case 'past invoices':
        const line = data
        lineData = {
          invoice_id: inv.id,
          item_id: line.item.id,
          quantity: quantity(data),
          price: price(data, invoiceType)
        }
      break;

      case 'inventory':
        const inventory = data
        const newItem = await item.create({
          contents_attributes: {
            inventory_id: parseInt(inventory.id)
          }
        }, this.ajaxOptions)
        if (newItem) {
          lineData = {
            invoice_id: inv.id,
            item_id: newItem.id,
            quantity: itemQty(newItem),
            price: itemPrice(newItem, invoiceType)
          }
        }
      break;

      default:
      break;
    }

    const newLine = await line.create(lineData, this.ajaxOptions)

    this.setState(prevState => ({
      inv: {
        ...prevState.inv,
        lines: [
          ...prevState.inv.lines,
          newLine
        ]
      },
      fields: {
        ...prevState.fields,
        lines: [
          ...prevState.fields.lines,
          newLine
        ]
      },
      showItemModal: false
    }))
  }

  // ----------------------------Handle-Change----------------------------------

  handleChange = (e, type) => {
    let { name, value } = e.target
    if (type === 'number') value = parseInt(value)
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        [name]: value
      },
      formData: {
        ...prevState.formData,
        [name]: value
      }
    }))
  }

  handleClientChange = async(name, value) => {
    this.setField(name, value)
    const clients = await this.findClients(value)
    if (!value || !clients || clients.length < 0) {

      this.setState(prevState => ({
        formData: {
          ...prevState.formData,
          client_id: null
        }
      }))

    }

    this.setState(prevState => ({
      searchFieldData: {
        ...prevState.searchFieldData,
        clients
      }
    }))
  }

  handleLineChange = (e, lineId, nme, val) => {
    const { inv, inv: { lines }  } = this.state
    let { name, value } = e.target
    if (nme) name = nme
    if (val) value = val


    const updatedLines = lines.map( line => {
      if (line.id !== lineId) return line
      switch (name) {

        case 'inc':
        if (!line.inc) {
          return (
            {
              ...line,
              inc: !line.inc,
              price: price(line, inv.kind)
            }
          )
        } else {
          return (
            {
              ...line,
              inc: !line.inc,
              price: 0
            }
          )
        }

        case 'quantity':
        return (
          {
            ...line,
            quantity: parseInt(value),
            price: parseFloat( price( {...line, quantity: parseInt(value) }, inv.kind))
          }
        )

        case 'price':
        return (
          {
            ...line,
            price: parseFloat(value)
          }
        )

        default:
        return (
          {
            ...line,
            [name]: value
          }
        )

      }

    })

    this.setState(prevState => ({
      inv: {
        ...prevState.inv,
        lines: updatedLines
      },
      fields: {
        ...prevState.fields,
        lines: updatedLines
      },
      formData: {
        ...prevState.formData,
        lines_attributes: updatedLines
      }
    }),
    async() => {
      await this.updateSummary()
    });
  }

  handleSummaryChange = (e) => {
    let { name, value } = e.target
    let val = value;
    if (value === '') val = 0;
    if (val < 999999) {
      switch (name) {
        case 'discount':
          this.setState(prevState => ({
            inv: {
              ...prevState.inv,
              [name]: value,
              total: prevState.inv.subTotal - parseInt(val)
            },
            fields: {
              ...prevState.fields,
              [name]: value,
              total: prevState.fields.subTotal - parseInt(val)
            },
            formData: {
              ...prevState.formData,
              [name]: value,
              total: prevState.formData.subTotal - parseInt(val)
            }
          }))
          break;
        case 'deposit':
          this.setState(prevState => ({
            inv: {
              ...prevState.inv,
              [name]: value,
              balance: prevState.inv.total - parseInt(value)
            },
            fields: {
              ...prevState.fields,
              [name]: value,
              balance: prevState.fields.total - parseInt(value)
            },
            formData: {
              ...prevState.formData,
              [name]: value,
              balance: prevState.formData.total - parseInt(value)
            }
          }))
          break;
        default:
          break;
      }
    }
  }

  // -------------------------Client-Search-Field-------------------------------

  handleSelect = (e, name, index) => {
    let data;
    const { searchFieldData } = this.state
    if (searchFieldData) {
      data = searchFieldData.clients[index]
      const client = clientName(data, {oneLine: true});
      if (data) {
        this.setState(prevState => ({
          formData: {
            ...prevState.formData,
            client_id: data.id
          },
          fields: {
            ...prevState.fields,
            client
          }
        }))
      }
    }
  }

  handleFormSubmit = (e, name, index) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      this.handleSelect( e, name, index)
    }
  }

  findClients = async(query) => {
    const q = query.split('')
    if (q.length > 2) {
      const data = await client.batch({ page: 1, q: query }, this.ajaxOptions)
      return data.clients
    }
  }

  // -------------------------------DB-CRUD-------------------------------------

  updateSummary = async() => {
    await this.setSubTotal(true)
  }

  handleSubmit = async() => {
    const { inv, formData, editMode, fromEvent } = this.state
    const { isNew, match, history, evtId, user: { accessLevel }} = this.props
    if (fromEvent) {
      if (isNew) {
        if (formData) {
          const newInvoice = await invoice.create(formData, this.ajaxOptions)
          this.setState({ inv: newInvoice })
          await this.close(true)
        } else {
          await this.close()
        }
        history.push(`/${accessLevel}/events/${evtId}`, {view: 'Invoice'})
      } else {
        const updatedInvoice = await invoice.update(inv.id, formData, this.ajaxOptions)
        await this.setState({ inv: updatedInvoice }, async() => await this.close(true))
      }

    } else {
      if (isNew) {
        if (formData) {
          const newInvoice = await this.props.handleCreate(formData);
          const url = () => {
            let words = `${match.path}`.split('/')
            words.pop()
            const link = words.join('/')
            return link
          }
          history.push(`${url()}/${newInvoice.id}`)

        } else {
          this.close(true)
        }
      } else {
        const updatedInvoice = await this.props.handleUpdate(inv, formData)
        await this.setState({ inv: updatedInvoice }, async() => await this.close(true))
      }
    }

    if (editMode) {
      this.setEditMode(false)
    }
  }

  handleDelete = async() => {
    const { inv, fromEvent } = this.state
    const { handleDelete, setView } = this.props
    if (fromEvent) {
      await invoice.delete(inv.id, this.ajaxOptions)
      if (setView) setView('Invoice')
    } else {
      await handleDelete(inv)
    }
  }

  // --------------------------------Views--------------------------------------

  close = async (turnOffEditMode) => {
    await this.resetForm();
    await this.resetSearchFieldData();
    await this.resetFields();
    await this.setFields();
    await this.setClientName();
    await this.setLines();
    if (turnOffEditMode) {
      await this.setEditMode(false);
    }
  }

  closeItemModal = () => {
    this.setState({ showItemModal: false })
  }

  render(){
    const { mobile } = this.props
    return (
      <div className="InvoiceDetail" ref={this.container}>
        <Header
          {...this.props}
          {...this.state}
          edit={() => this.setEditMode(true)}
          close={this.close}
          delete={this.handleDelete}
          submit={this.handleSubmit}
        />
        <main>
          <SubHeader
            {...this.props}
            {...this.state}
            handleChange={this.handleChange}
            handleClientChange={this.handleClientChange}
            onSelect={this.handleSelect}
            onEnter={this.handleFormSubmit}
          />
          <section>
            <Invoice
              {...this.props}
              {...this.state}
              handleLineChange={this.handleLineChange}
              addLine={this.addLine}
              deleteLine={this.deleteLine}
              setSubTotal={this.setSubTotal}
            />
            <Summary
              {...this.props}
              {...this.state}
              handleChange={this.handleSummaryChange}
            />
          </section>
        </main>

        <div className="InvoiceDetail--delete">
          <h3>Delete</h3>
        </div>

        {mobile?
          <Buttons
            {...this.props}
            {...this.state}
            scrollToTop={this.scrollToTop}
            edit={() => this.setEditMode(!this.state.editMode)}
            handleSubmit={this.handleSubmit}
            />
          :
          null
        }

        {
          this.state.showItemModal?
          <Modal
            close={(e) => {
              e.stopPropagation()
              this.closeItemModal()
            }}
            content={<ItemSelector {...this.props} {...this.state} addItem={this.addItem}/>}
            closeIconColor='var(--light-gray)'
          />
          :
          null
        }
      </div>
    )
  }
}
