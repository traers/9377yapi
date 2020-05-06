import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { Icon, Row, Col, Form, Input, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
import constants from 'client/constants/variable.js';

const initMap = {
  header: [
    {
      name: '',
      value: ''
    }
  ]
};

class ProjectProtocolsContent extends Component {
  static propTypes = {
    projectMsg: PropTypes.object,
    form: PropTypes.object,
    onSubmit: PropTypes.func,
    handleProtocolsInput: PropTypes.func
  };

  initState(curdata) {
    let header = [
      {
        name: '',
        value: ''
      }
    ];
    const curheader = curdata.header;
    if (curheader && curheader.length !== 0) {
      curheader.forEach(item => {
        header.unshift(item);
      });
    }
    return { header };
  }

  constructor(props) {
    super(props);
    this.state = Object.assign({}, initMap);
  }
  addHeader = (value, index, name) => {
    let nextHeader = this.state[name][index + 1];
    if (nextHeader && typeof nextHeader === 'object') {
      return;
    }
    let newValue = {};
    let data = { name: '', value: '' };
    newValue[name] = [].concat(this.state[name], data);
    this.setState(newValue);
  };

  delHeader = (key, name) => {
    let curValue = this.props.form.getFieldValue(name);
    let newValue = {};
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    });
    this.props.form.setFieldsValue(newValue);
    this.setState(newValue);
  };

  handleInit(data) {
    this.props.form.resetFields();
    let newValue = this.initState(data);
    this.setState({ ...newValue });
  }

  componentWillReceiveProps(nextProps) {
    let curProtocolsName = this.props.projectMsg.name;
    let nextProtocolsName = nextProps.projectMsg.name;
    if (curProtocolsName !== nextProtocolsName) {
      this.handleInit(nextProps.projectMsg);
    }
  }

  handleOk = e => {
    e.preventDefault();
    const { form, onSubmit, projectMsg } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        let header = values.header.filter(val => {
          return val.name !== '';
        });
        let assignValue = {};
        assignValue.protocols = Object.assign(
          { _id: projectMsg._id },
          {
            name: values.protocols.name,
            header: header
          }
        );
        onSubmit(assignValue);
      }
    });
  };

  render() {
    const { projectMsg } = this.props;
    const { getFieldDecorator } = this.props.form;
    const headerTpl = (item, index) => {
      const headerLength = this.state.header.length - 1;
      return (
        <Row gutter={2} key={index}>
          <Col span={10}>
            <FormItem>
              {getFieldDecorator('header[' + index + '].name', {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: item.name || ''
              })(
                <AutoComplete
                  style={{ width: '200px' }}
                  allowClear={true}
                  dataSource={constants.HTTP_REQUEST_HEADER}
                  placeholder="请输入header名称"
                  onChange={() => this.addHeader(item, index, 'header')}
                  filterOption={(inputValue, option) =>
                    option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem>
              {getFieldDecorator('header[' + index + '].value', {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue: item.value || ''
              })(<Input placeholder="请输入参数内容" style={{ width: '90%', marginRight: 8 }} />)}
            </FormItem>
          </Col>
          <Col span={2} className={index === headerLength ? ' protocols-last-row' : null}>
            {/* 新增的项中，只有最后一项没有有删除按钮 */}
            <Icon
              className="dynamic-delete-button delete"
              type="delete"
              onClick={e => {
                e.stopPropagation();
                this.delHeader(index, 'header');
              }}
            />
          </Col>
        </Row>
      );
    };

    const protocolsTpl = data => {
      return (
        <div>
          <h3 className="protocols-label">协议头名称</h3>
          <FormItem required={false}>
            {getFieldDecorator('protocols.name', {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: data.name === '新协议头' ? '' : data.name || '',
              rules: [
                {
                  required: false,
                  whitespace: true,
                  validator(rule, value, callback) {
                    if (value) {
                      if (value.length === 0) {
                        callback('请输入协议头名称');
                      } else if (!/\S/.test(value)) {
                        callback('请输入协议头名称');
                      } else {
                        return callback();
                      }
                    } else {
                      callback('请输入协议头名称');
                    }
                  }
                }
              ]
            })(
              <Input
                onChange={e => this.props.handleProtocolsInput(e.target.value)}
                placeholder="请输入协议头名称"
                style={{ width: '90%', marginRight: 8 }}
              />
            )}
          </FormItem>
          <h3 className="protocols-label">Header</h3>
          {this.state.header.map((item, index) => {
            return headerTpl(item, index);
          })}
        </div>
      );
    };

    return (
      <div>
        {protocolsTpl(projectMsg)}
        <div className="btnwrap-changeproject">
          <Button
            className="m-btn btn-save"
            icon="save"
            type="primary"
            size="large"
            onClick={this.handleOk}
          >
            保 存
          </Button>
        </div>
      </div>
    );
  }
}
export default Form.create()(ProjectProtocolsContent);
