import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { Icon, Layout, Tooltip, message, Row, Popconfirm } from 'antd';
const { Content, Sider } = Layout;
import ProjectProtocolsContent from './ProjectProtocolsContent.js';
import { connect } from 'react-redux';
import { updateProtocols, getProject, getProtocols } from '../../../../reducer/modules/project';
import EasyDragSort from '../../../../components/EasyDragSort/EasyDragSort.js';

@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {
    updateProtocols,
    getProject,
    getProtocols
  }
)
class ProjectProtocols extends Component {
  static propTypes = {
    projectId: PropTypes.number,
    updateProtocols: PropTypes.func,
    getProject: PropTypes.func,
    projectMsg: PropTypes.object,
    onOk: PropTypes.func,
    getProtocols: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      protocols: [],
      _id: null,
      currentProtocolsMsg: {},
      delIcon: null,
      currentKey: -2
    };
  }

  initState(curdata, id) {
    let newValue = {};
    newValue['protocols'] = [].concat(curdata);
    newValue['_id'] = id;
    this.setState({
      ...this.state,
      ...newValue
    });
  }

  async componentWillMount() {
    this._isMounted = true;
    await this.props.getProject(this.props.projectId);
    const { protocols, _id } = this.props.projectMsg;
    this.initState(protocols, _id);
    this.handleClick(0, protocols[0]);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleClick = (key, data) => {
    this.setState({
      currentProtocolsMsg: data,
      currentKey: key
    });
  };

  // 增加协议头变量项
  addParams = (name, data) => {
    let newValue = {};
    data = { name: '新协议头', domain: '', header: [] };
    newValue[name] = [].concat(data, this.state[name]);
    this.setState(newValue);
    this.handleClick(0, data);
  };

  // 删除提示信息
  showConfirm(key, name) {
    let assignValue = this.delParams(key, name);
    this.onSave(assignValue);
  }

  // 删除协议头变量项
  delParams = (key, name) => {
    let curValue = this.state.protocols;
    let newValue = {};
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    });
    this.setState(newValue);
    this.handleClick(0, newValue[name][0]);
    newValue['_id'] = this.state._id;
    return newValue;
  };

  enterItem = key => {
    this.setState({ delIcon: key });
  };

  // 保存设置
  async onSave(assignValue) {
    await this.props
      .updateProtocols(assignValue)
      .then(res => {
        if (res.payload.data.errcode == 0) {
          this.props.getProject(this.props.projectId);
          this.props.getProtocols(this.props.projectId);
          message.success('修改成功! ');
          if(this._isMounted) {
            this.setState({ ...assignValue });
          }
        }
      })
      .catch(() => {
        message.error('协议头设置不成功 ');
      });
  }

  //  提交保存信息
  onSubmit = (value, index) => {
    let assignValue = {};
    assignValue['protocols'] = [].concat(this.state.protocols);
    assignValue['protocols'].splice(index, 1, value['protocols']);
    assignValue['_id'] = this.state._id;
    this.onSave(assignValue);
    this.props.onOk && this.props.onOk(assignValue['protocols'], index);
  };

  // 动态修改协议头名称
  handleInputChange = (value, currentKey) => {
    let newValue = [].concat(this.state.protocols);
    newValue[currentKey].name = value || '新协议头';
    this.setState({ protocols: newValue });
  };

  // 侧边栏拖拽
  handleDragMove = name => {
    return (data, from, to) => {
      let newValue = {
        [name]: data
      };
      this.setState(newValue);
      newValue['_id'] = this.state._id;
      this.handleClick(to, newValue[name][to]);
      this.onSave(newValue);
    };
  };

  render() {
    const { protocols, currentKey } = this.state;

    const protocolsSettingItems = protocols.map((item, index) => {
      return (
        <Row
          key={index}
          className={'menu-item ' + (index === currentKey ? 'menu-item-checked' : '')}
          onClick={() => this.handleClick(index, item)}
          onMouseEnter={() => this.enterItem(index)}
        >
          <span className="protocols-icon-style">
            <span className="protocols-name" style={{ color: item.name === '新协议头' && '#2395f1' }}>
              {item.name}
            </span>
            <Popconfirm
              title="您确认删除此协议头变量?"
              onConfirm={e => {
                e.stopPropagation();
                this.showConfirm(index, 'protocols');
              }}
              okText="确定"
              cancelText="取消"
            >
              <Icon
                type="delete"
                className="interface-delete-icon"
                style={{
                  display: this.state.delIcon == index && protocols.length - 1 !== 0 ? 'block' : 'none'
                }}
              />
            </Popconfirm>
          </span>
        </Row>
      );
    });

    return (
      <div className="m-protocols-panel">
        <Layout className="project-protocols">
          <Sider width={195} style={{ background: '#fff' }}>
            <div style={{ height: '100%', borderRight: 0 }}>
              <Row className="first-menu-item menu-item">
                <div className="protocols-icon-style">
                  <h3>
                    协议头列表&nbsp;<Tooltip placement="top" title="在这里添加项目的协议头配置">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </h3>
                  <Tooltip title="添加协议头变量">
                    <Icon type="plus" onClick={() => this.addParams('protocols')} />
                  </Tooltip>
                </div>
              </Row>
              <EasyDragSort data={() => protocols} onChange={this.handleDragMove('protocols')}>
                {protocolsSettingItems}
              </EasyDragSort>
            </div>
          </Sider>
          <Layout className="protocols-content">
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              <ProjectProtocolsContent
                projectMsg={this.state.currentProtocolsMsg}
                onSubmit={e => this.onSubmit(e, currentKey)}
                handleProtocolsInput={e => this.handleInputChange(e, currentKey)}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default ProjectProtocols;
