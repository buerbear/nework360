import { Button, Menu, Modal } from 'antd'
import { message } from 'antd/lib/index'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  changePwd,
  deleteSkill,
  getMailCode,
  getPhoneCode,
  getSkillByUserId,
  getUserById,
  postSkill,
  updateUser,
  verifyEmail,
  verifyPhoneNumber,
} from '../../service/editData'
import { getCityTree, getServiceTree } from '../../service/homepage'
import { view as EditDataForm } from './EditDataForm'
import { view as ModalForm } from './ModalForm'
import './static/style/index.less'

const MenuItem = Menu.Item

const mapState = (state) => ({
  user: state.user,
})

function CardItem ({ imgSrc, title, isSelected, handleClick }) {
  return (
    <div
      className={
        isSelected
          ? 'select-type-card-item selected-card-item'
          : 'select-type-card-item'
      }
      onClick={ handleClick }
    >
      <img
        src={ imgSrc }
        width={ 50 }
        height={ 50 }
        alt={ title }
      />
      <i className="iconfont icon-selected"/>
      <p>{ title }</p>
    </div>
  )
}

function SecondaryCardItem ({ content, isChecked, handleClick }) {
  return (
    <div
      className={
        isChecked
          ? 'select-type-card-item selected-card-item'
          : 'select-type-card-item'
      }
      onClick={ handleClick }
    >
      <i className="iconfont icon-selected"/>
      { content }
    </div>
  )
}

@connect(mapState)
class EditData extends Component {
  state = {
    selectedItem: 'avatar',
    countryOptions: [],
    provinceOptions: [],
    cityOptions: [],
    cityData: [],
    data: {},
    menuItemList: [
      {
        key: 'basic',
        content: '基本资料',
      },
      {
        key: 'avatar',
        content: '照片',
      },
      {
        key: 'skill',
        content: '我的技能',
      },
      {
        key: 'auth',
        content: '信任',
      },
      {
        key: 'account',
        content: '账号安全',
      },
    ],
    pwd: '',
    newPwd: '',
    newPwdRepeat: '',
    modalType: '',
    phoneCode: '',
    mailCode: '',
    modalVisible: false,
    modalTitle: '',
    skillList: [],
    skillModalStep: 0,
    skillModalVisible: false,
    firstServiceList: [],
    secondServiceList: [],
    selectedFirstService: '',
    selectedSecondService: [],
    serviceTree: {},
  }
  getCityTree = async () => {
    try {
      const { data: { code, data } } = await getCityTree()
      if (code !== 200) {
        return message.error('请求服务器失败')
      }
      const tree = data
      window.tree = data
      const countryList = Object.keys(tree)
      const provinceList = Object.keys(tree[ '中国' ])
      const letterCityList = tree[ '中国' ][ '北京' ].map(item => item.chinese)
      this.setState({
        tree,
        countryOptions: countryList,
        provinceOptions: provinceList,
        cityOptions: letterCityList,
        cityData: tree[ this.state.data.country ][ this.state.data.province ],
      })
    } catch (e) {
      message.error('请求服务器失败')
    }
  }
  getUserById = async () => {
    try {
      const { data: { data, code } } = await getUserById({ userId: 11 })
      console.log(data)
      this.setState({ data: { ...data, serviceTime: data.serviceTime.split(',') } })
      if (code !== 200) {
        return message.error('请求服务器错误')
      }
    } catch (e) {
      message.error('请求服务器失败')
    }
  }

  handleClick = ({ key }) => {
    this.setState({
      selectedItem: key,
    })
  }
  getSkillByUserId = async () => {
    try {
      const { data: { code, data, desc } } = await getSkillByUserId({ userId: this.props.user.userId })
      if (code !== 200) {
        message.error(desc)
        return
      }

      const secondarySkillList = Object
        .values(data.skill)
        .reduce((pre, cur) => [ ...pre, ...cur ])

      this.setState({
        skillList: [ ...secondarySkillList, ...data.skillTemp ],
      })
    } catch (e) {
      message.error('请求服务器失败')
    }
  }
  handleInput = type => e => this.setState({
    data: { ...this.state.data, [ type ]: e.target.value },
  })
  handleAvatarChange = avatar => this.setState({
    data: { ...this.state.data, ...{ avatar } },
  })
  handleServiceTimeChange = (serviceTime) => {
    this.setState({
      data: { ...this.state.data, serviceTime },
    })
  }

  handlePwdChange = e => this.setState({
    pwd: e.target.value,
  })

  handleNewPwdChange = e => this.setState({
    newPwd: e.target.value,
  })

  handleNewPwdRepeatChange = e => this.setState({
    newPwdRepeat: e.target.value,
  })
  handleCountryChange = (value) => {
    console.log('handleCountryChange', this.state.tree[ value ])
    const provinceOptions = Object.keys(this.state.tree[ value ])
    const cityData = this.state.tree[ value ][ provinceOptions[ 0 ] ]
    const cityOptions = cityData.map(item => item.chinese)
    this.setState({
      data: {
        ...this.state.data, ...{
          country: value,
          province: Object.keys(this.state.tree[ value ])[ 0 ],
          city: cityOptions[ 0 ],
        },
      },
      provinceOptions,
      cityData,
      cityOptions,
    })
  }
  handleProvinceChange = (value) => {
    const cityData = this.state.tree[ this.state.data.country ][ value ]
    const cityOptions = cityData.map(item => item.chinese)
    this.setState({
      data: { ...this.state.data, ...{ province: value, city: cityOptions[ 0 ] } },
      cityData,
      cityOptions,
    })

  }
  handleCityChange = (value) => {
    this.setState({
      data: {
        ...this.state.data,
        ...{ city: value },
      },
    })
  }
  handleSaveBasic = async () => {
    try {
      console.log('handleSaveBasic')
      console.log('cityData+++++', this.state.cityData)
      const { data: { desc, code } } = await updateUser({
        userId: this.props.user.userId,
        nickname: this.state.data.nickname,
        district: (this.state.cityData.find(item => item.chinese === this.state.data.city).districtId),
        serviceTime: this.state.data.serviceTime.join(','),
        description: this.state.data.description,
        location: this.state.data.location,
        specAddr: this.state.data.specAddr,
      })
      if (code !== 200) {
        message.error(desc)
        return
      }
      message.success('更新资料成功')
    } catch (e) {
      message.error('请求服务器失败')
    }
  }
  handleShowAddSkillModal = () => {
    this.setState({
      skillModalVisible: true,
    })
  }

  handleChangePwdSubmit = async () => {
    try {
      const { data: { code, desc } } = await changePwd({
        pwd: this.state.pwd,
        newPwd: this.state.newPwd,
      })
      if (code !== 200) {
        message.error(desc)
        return
      }
      message.success('修改密码成功')
    } catch (e) {
      message.error('请求服务器失败')
    }

  }

  handleSave = (type) => async () => {
    try {
      const { data: { code } } = await updateUser({
        userId: 11,
        [ type ]: this.state.data[ type ],
      })
      if (code !== 200) {
        message.error('请求服务器失败')
        return
      }
      message.success('更新资料成功')
    } catch (e) {
      message.error('请求服务器失败')
    }
  }
  getPhoneCode = async () => {
    try {
      const { data: { code, desc } } = await getPhoneCode({ phoneNumber: this.state.data.phoneNumber })
      if (code !== 200) {
        message.error(desc)
        return
      }
      message.success('已发送验证码')
    } catch (e) {
      message.error('请求服务器失败')
    }
  }

  handleShowModal = (modalType, modalTitle) => () => {
    this.setState({
      modalType,
      modalTitle,
      modalVisible: true,
    })
  }
  getMailCode = async () => {
    try {
      const { data: { code, desc } } = await getMailCode({ email: this.state.data.email })
      if (code !== 200) {
        message.error(desc)
        return
      }
      message.success('已发送验证码')
    } catch (e) {
      message.error('请求服务器失败')
    }
  }

  handleModalCancel = () => this.setState({
    modalType: '',
    modalTitle: '',
    modalVisible: false,
  })
  handlePhoneCodeChange = e => this.setState({ phoneCode: e.target.value })
  handleMailCodeChange = e => this.setState({ mailCode: e.target.value })
  verifyPhoneNumber = async () => {
    try {
      const { data: { code, desc } } = await verifyPhoneNumber({
        phoneNumber: this.state.data.phoneNumber,
        code: this.state.phoneCode,
      })
      if (code !== 200) {
        message.error(desc)
        return
      } else {
        const { data: { code, desc } } = await updateUser({
          userId: this.state.data.userId,
          phoneNumber: this.state.data.phoneNumber,
        })
        if (code !== 200) {
          message.error(desc)
          return
        }
      }
      message.success('验证手机号成功')
      this.handleModalCancel()
    } catch (e) {
      message.error('请求服务器失败')
    }
  }
  verifyEmail = async () => {
    try {
      const { data: { code, desc } } = await verifyEmail({
        email: this.state.data.email,
        code: this.state.mailCode,
      })
      if (code !== 200) {
        message.error('认证失败')
        return
      } else {
        const { data: { code, desc } } = await updateUser({
          userId: this.props.user.userId,
          email: this.state.data.email,
        })
        if (code !== 200) {
          message.error('认证失败')
          return
        }
        message.success('验证邮箱成功')
      }
      this.handleModalCancel()
    } catch (e) {
      message.error('请求服务器失败')
    }
  }
  deleteSkill = (skillId, isTemp, deleteIndex) => async () => {
    try {
      const { data: { code, desc } } = await deleteSkill({
        isTemp,
        skillId,
      })
      if (code !== 200) {
        message.error(desc)
        return
      }
      this.setState({
        skillList: this.state.skillList.filter((item, index) => index !== deleteIndex),
      })
      message.success('删除技能成功')
    } catch (e) {
      message.error('请求服务器失败')
    }
  }
  getServiceTree = async () => {
    try {
      const { data: { code, data, desc } } = await getServiceTree({ cityId: this.props.user.district })
      if (code !== 200) {
        message.error(desc)
        return
      }
      console.log(data)
      const firstServiceList = data.map(item => item.serviceTypeName)
      console.log('firstLevelServiceList', firstServiceList)
      console.log('serviceTree', data)
      this.setState({
        firstServiceList,
        serviceTree: data,
      })
    } catch (e) {
      message.error(e)
      // message.error('请求服务器失败')
    }
  }
  hideSkillModal = () => this.setState({
    skillModalVisible: false,
  })
  skillModalNextStep = () => this.setState({
    skillModalStep: 1,
  })
  handleFirstServiceSelect = (serviceName) => () => this.setState({
    selectedFirstService: serviceName,
    secondServiceList: this.state.serviceTree.find(item => item.serviceTypeName === serviceName).child,
  })
  handleSecondServiceSelect = (skillId) => () => {
    if (this.state.selectedSecondService.includes(skillId)) {
      this.setState({
        selectedSecondService: this.state.selectedSecondService.filter(item => item !== skillId),
      })
    } else {
      this.setState({
        selectedSecondService: [ ...this.state.selectedSecondService, skillId ],
      })
    }
  }
  addSkill = async () => {
    try {
      const { data: { code, desc } } = await postSkill({
        userId: this.props.user.userId,
        latitude: this.props.user.latitude,
        longitude: this.props.user.longitude,
        serviceIds: this.state.selectedSecondService.join(','),
      })
      if (code !== 200) {
        message.error(desc)
        return
      }
      message.success('添加技能成功')
    } catch (e) {
      message.error(e)
    }

  }

  render () {
    const {
      selectedItem,
      data,
      menuItemList,
      pwd,
      newPwd,
      newPwdRepeat,
      modalVisible,
      modalTitle,
      modalType,
      phoneCode,
      skillList,
      countryOptions,
      provinceOptions,
      cityOptions,
      mailCode,
      skillModalStep,
      skillModalVisible,
      firstServiceList,
      selectedFirstService,
      secondServiceList,
      selectedSecondService,
    } = this.state
    return (
      <div className="edit-data-container">
        <Menu
          onClick={ this.handleClick }
          style={ { width: 188, minHeight: 800, height: '100%' } }
          defaultSelectedKeys={ [ 'balance' ] }
          mode="inline"
        >
          { menuItemList.map(({ key, content }) => <MenuItem key={ key }>{ content }</MenuItem>) }
        </Menu>
        <div className="content">
          <EditDataForm
            selectedItem={ selectedItem }
            data={ data }
            handleInput={ this.handleInput }
            pwd={ pwd }
            handlePwdChange={ this.handlePwdChange }
            newPwd={ newPwd }
            handleNewPwdChange={ this.handleNewPwdChange }
            newPwdRepeat={ newPwdRepeat }
            handleNewPwdRepeatChange={ this.handleNewPwdRepeatChange }
            handleChangePwdSubmit={ this.handleChangePwdSubmit }
            handleAvatarChange={ this.handleAvatarChange }
            handleSave={ this.handleSave }
            handleShowModal={ this.handleShowModal }
            skillList={ skillList }
            countryOptions={ countryOptions }
            provinceOptions={ provinceOptions }
            cityOptions={ cityOptions }
            handleCountryChange={ this.handleCountryChange }
            handleProvinceChange={ this.handleProvinceChange }
            handleCityChange={ this.handleCityChange }
            handleServiceTimeChange={ this.handleServiceTimeChange }
            handleSaveBasic={ this.handleSaveBasic }
            user={ this.props.user }
            deleteSkill={ this.deleteSkill }
            handleShowAddSkillModal={ this.handleShowAddSkillModal }
          />
        </div>
        <Modal
          title={ <h2>{ modalTitle }</h2> }
          visible={ modalVisible }
          style={ { top: 'calc(50% - 205px)' } }
          maskStyle={ {
            backgroundColor: '#edf1f4',
            opacity: 0.9,
          } }
          bodyStyle={ {
            width: '520px',
            boxShadow: '0 0 10px 0 rgba(9,34,53,0.10)',
            borderRadius: '4px',
          } }
          footer={ null }
          onCancel={ this.handleModalCancel }
        >
          <ModalForm
            modalType={ modalType }
            data={ data }
            phoneCode={ phoneCode }
            mailCode={ mailCode }
            handleModalCancel={ this.handleModalCancel }
            getPhoneCode={ this.getPhoneCode }
            getMailCode={ this.getMailCode }
            handleInput={ this.handleInput }
            handlePhoneCodeChange={ this.handlePhoneCodeChange }
            verifyPhoneNumber={ this.verifyPhoneNumber }
            handleMailCodeChange={ this.handleMailCodeChange }
            verifyEmail={ this.verifyEmail }
            handleSave={ this.handleSave }
          />
        </Modal>
        <Modal
          title={ <h2>{ skillModalStep ? '让我们缩小一下范围' : '选择技能' }</h2> }
          visible={ skillModalVisible }
          footer={ skillModalStep
            ? <Button type="primary" onClick={ this.addSkill }>完成</Button>
            : <Button type="primary" onClick={ this.skillModalNextStep }>下一步</Button>
          }
          onCancel={ this.hideSkillModal }
          style={ {
            width: '760px!important',
          } }
        >
          {
            skillModalStep
              ? <div className="secondary-type-select-container">
                {
                  secondServiceList.map(({ serviceTypeName, serviceTypeId }) =>
                    <SecondaryCardItem
                      content={ serviceTypeName }
                      key={ serviceTypeName }
                      isChecked={ selectedSecondService.includes(serviceTypeId) }
                      handleClick={ this.handleSecondServiceSelect(serviceTypeId) }
                    />,
                  )
                }
              </div>
              : <div className="select-type-card-container">
                {
                  firstServiceList.map((serviceName) =>
                    <CardItem
                      imgSrc={ './images/head-test.jpg' }
                      title={ serviceName }
                      key={ serviceName }
                      isSelected={ serviceName === selectedFirstService }
                      handleClick={ this.handleFirstServiceSelect(serviceName) }
                    />)
                }
              </div>
          }
        </Modal>
      </div>
    )
  }

  componentDidMount () {
    this.getCityTree()
    this.getUserById()
    this.getSkillByUserId()
    this.getServiceTree()
  }

}

export { EditData as page }
