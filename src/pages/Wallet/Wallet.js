import { Menu, Table } from 'antd'
import React, { Component } from 'react'
import { getUserAccount, getUserTransactionRecord } from '../../service/wallet'
import './static/style/index.less'

const MenuItem = Menu.Item

function Content ({
                    nkc,
                    clue,
                    money,
                    selectedItem,
                    transactionRecordList,
                  }) {
  if (selectedItem === 'balance') {
    return (
      <div>
        <h2>账户余额</h2>
        <div className="balance-container">
          <div className="balance-item">
            <p className="item-title">法定货币</p>
            <div className="balance-item-card balance-item-card-1">
              <img
                src="./images/balance-rmb.png"
                alt="rmb"
                width="40"
                height="40"
              />
              <p className="title">
                { money / 100 }
              </p>
              <p className="balance-type">人民币（CNY）</p>
              <a href="/">提现</a>
            </div>
          </div>
          <div className="balance-item">
            <p className="item-title">数字货币</p>
            <div className="balance-item-card balance-item-card-2">
              <img
                src="./images/balance-nkc.png"
                alt="nkc"
                width="40"
                height="40"
              />
              <p className="title">
                { nkc }
              </p>
              <p className="balance-type">NKC</p>
              <a href="/">提现</a>
            </div>
          </div>
          <div className="balance-item">
            <p className="item-title">卡包</p>
            <div className="balance-item-card balance-item-card-3">
              <img
                src="./images/balance-clue.png"
                alt="clue"
                width="40"
                height="40"
              />
              <p className="title">
                { clue }
              </p>
              <p className="balance-type">线索卡（张）</p>
              <a href="/">购买</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (selectedItem === 'records') {
    const columns = [
      {
        title: '流水号',
        dataIndex: 'recordOrderId',
        key: 'recordOrderId',
        width: 120,
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 130,
        render (value) {
          return parseInt(value, 10) / 100
        },
      },
      {
        title: '交易类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
      },
      {
        title: '账户',
        dataIndex: 'userAName',
        key: 'userAName',
        width: 100,
      },
      {
        title: '交易状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render (value) {
          switch (value) {
            case 'pay_success':
              return '支付成功'
            case 'receipt_success':
              return '收款成功'
            default:
              return ''
          }
        },
      },
      {
        title: '交易时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 130,
      },
    ]

    return (
      <div>
        <h2>交易记录</h2>
        <Table
          rowKey="id"
          columns={ columns }
          dataSource={ transactionRecordList }
          bordered={ false }
          rowClassName="table-row"
        />
      </div>
    )
  }
}

class Wallet extends Component {
  state = {
    money: '',
    nkc: '',
    clue: '',
    selectedItem: 'balance',
    transactionRecordList: [],
  }

  handleClick = ({key}) => {
    this.setState({
      selectedItem: key,
    })
  }
  getUserAccount = async () => {
    const {data: {data, code}} = await getUserAccount()
    if (code === 200) {
      this.setState({
        money: data.money,
        nkc: data.nkc,
        clue: data.cule,
      })
    }
  }
  getUserTransactionRecord = async () => {
    const {data: {data, code}} = await getUserTransactionRecord()
    if (code === 200) {
      this.setState({
        transactionRecordList: data,
      })
    }
  }

  render () {
    const {
      nkc,
      clue,
      money,
      selectedItem,
      transactionRecordList,
    } = this.state
    return (
      <div className="wallet-container">
        <Menu
          onClick={ this.handleClick }
          style={ {width: 188, height: 800} }
          defaultSelectedKeys={ ['balance'] }
          mode="inline"
        >
          <MenuItem key="balance">账户余额</MenuItem>
          <MenuItem key="records">交易记录</MenuItem>
        </Menu>
        <div className="content">
          <Content
            nkc={ nkc }
            clue={ clue }
            money={ money }
            selectedItem={ selectedItem }
            transactionRecordList={ transactionRecordList }
          />
        </div>
      </div>
    )
  }

  componentDidMount () {
    this.getUserAccount()
    this.getUserTransactionRecord()
  }
}

export { Wallet as page }


