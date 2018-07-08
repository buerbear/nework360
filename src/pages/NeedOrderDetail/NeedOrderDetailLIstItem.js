import { Button, Rate } from 'antd'
import React from 'react'
import { getRate } from '../../utils'

function NeedOrderDetailLIstItem ({
                                    pay,
                                    score,
                                    amount,
                                    nickname,
                                    hireTimes,
                                    avatarSrc,
                                    scoreCount,
                                    joinedTime,
                                    cancelOrder,
                                    selectPartyB,
                                    buttonStatus,
                                    handleEvaluate,
                                  }) {
  return (
    <div
      className={ `order-detail-list-item-wrapper ${buttonStatus !== 'disabled' && buttonStatus !== 'select' ? 'selected-order-detail-list-item' : ''}` }>
      <i className="iconfont icon-selected"/>
      <div className="top-part">
        <div className="avatar-wrapper">
          <img src={ avatarSrc || './images/headshot-default.png' } alt="头像" width={ 50 } height={ 50 }/>
          <span className="online-communicate">在线沟通</span>
        </div>
        <div className="amount">{ `¥ ${amount}` }</div>
      </div>
      <h3>
        { nickname }
      </h3>
      <div className="middle">
        <Rate
          allowHalf
          disabled
          defaultValue={ getRate(score) }
          character={ <i className="iconfont icon-rate-star-full"/> }
        />
        <p className="rate">{ score }</p>
        <p className="evaluation">（{ scoreCount }条评价）</p>
      </div>
      <div className="bottom">
        <div className="info-wrapper">
          <div><i className="iconfont icon-hire"/>被雇佣{ hireTimes }次</div>
          <div><i className="iconfont icon-joined-time"/>{ joinedTime }</div>
        </div>
        {
          buttonStatus === 'selected' && <Button type="primary" onClick={ selectPartyB }>选择Ta</Button>
        }
        {
          buttonStatus === 'disabled' && <Button disabled={ true }>选择Ta</Button>
        }
        {
          buttonStatus === 'cancel' && <Button onClick={ cancelOrder }>取消订单</Button>
        }
        {
          buttonStatus === 'pay' && <Button onClick={ pay }>立即支付</Button>
        }
        {
          buttonStatus === 'evaluate' && <Button type="primary" onClick={ handleEvaluate }>立即评价</Button>
        }
      </div>
    </div>
  )
}

export { NeedOrderDetailLIstItem as view }
