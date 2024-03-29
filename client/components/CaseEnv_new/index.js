// 测试集合中的环境切换

import React from 'react';
import PropTypes from 'prop-types';
import { Select, Row, Col, Collapse, Icon, Tooltip } from 'antd';
const Option = Select.Option;
const Panel = Collapse.Panel;
import './index.scss';

export default class CaseEnv extends React.Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    envList: PropTypes.array,
    currProjectEnvChange: PropTypes.func,
    changeClose: PropTypes.func,
    collapseKey: PropTypes.any,
    envValue: PropTypes.object,
    protocolsList: PropTypes.array,
    protocolsValue: PropTypes.object,
    currProjectProtocolsChange: PropTypes.func
  };

  callback = key => {
    this.props.changeClose && this.props.changeClose(key);
  };

  render() {
    return (
      <Collapse
        style={{
          margin: 0,
          marginBottom: '16px'
        }}
        onChange={this.callback}
        // activeKey={this.state.activeKey}
        activeKey={this.props.collapseKey}
      >
        <Panel
          header={
            <span>
              {' '}
              选择测试用例环境
              <Tooltip title="默认使用测试用例选择的环境">
                {' '}
                <Icon type="question-circle-o" />{' '}
              </Tooltip>
            </span>
          }
          key="1"
        >
          <div className="case-env">
            {this.props.envList.length > 0 && (
              <div>
                {this.props.envList.map(item => {
                  return (
                    <Row
                      key={item._id}
                      type="flex"
                      justify="space-around"
                      align="middle"
                      className="env-item"
                    >
                      <Col span={6} className="label">
                        <Tooltip title={item.name}>
                          <span className="label-name">{item.name}</span>
                        </Tooltip>
                      </Col>
                      <Col span={18}>
                        <Select
                          style={{
                            width: '100%'
                          }}
                          value={this.props.envValue[item._id] || ''}
                          defaultValue=""
                          onChange={val => this.props.currProjectEnvChange(val, item._id)}
                        >
                          <Option key="default" value="">
                            默认环境
                          </Option>

                          {item.env.map(key => {
                            return (
                              <Option value={key.name} key={key._id}>
                                {key.name + ': ' + key.domain}
                              </Option>
                            );
                          })}
                        </Select>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )}
          </div>
          <div className="case-env">
            {this.props.protocolsList.length > 0 && (
              <div>
                {this.props.protocolsList.map(item => {
                  return (
                    <Row
                      key={item._id}
                      type="flex"
                      justify="space-around"
                      align="middle"
                      className="env-item"
                    >
                      <Col span={6} className="label">
                        <Tooltip title="协议头配置">
                          <span className="label-name">协议头配置</span>
                        </Tooltip>
                      </Col>
                      <Col span={18}>
                        <Select
                          style={{
                            width: '100%'
                          }}
                          value={this.props.protocolsValue[item._id] || ''}
                          defaultValue=""
                          onChange={val => this.props.currProjectProtocolsChange(val, item._id)}
                        >
                          <Option key="default" value="">
                          默认配置
                          </Option>
                          
                          {item.protocols.map(key => {
                            var headerString= ""
                            for (var i = 0; i < key.header.length; i++) {
                              if (i < key.header.length-1) {
                                headerString = headerString+key.header[i].name+ ' : '+key.header[i].value+" , ";
                              }
                              else{
                                headerString = headerString+key.header[i].name+ ' : '+key.header[i].value;
                              }
                              
                            }
                            return (
                              <Option value={key.name} key={key._id}>
                                {key.name + ' : [ ' + headerString+ ' ]'}
                              </Option>
                            );
                          })}
                        </Select>
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )}
          </div>
        </Panel>
      </Collapse>
    );
  }
}
