import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Field from './Field';
import {Input} from 'antd';
import {observer} from 'mobx-react';
import C from 'calc';

function roundValue(value) {
  let defaultValue;
  if(value && typeof value === 'object' && value.isDivided) {
    defaultValue = value.result;
  }else {
    defaultValue = value;
  }
  if (defaultValue === 0) {
    defaultValue = 0;
  } else if(isNaN(defaultValue) || !defaultValue) {
    defaultValue = '';
  }else{
    defaultValue = C.round(defaultValue);
  }
  return defaultValue;
}

@observer
class NumberField extends Field {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    negative: PropTypes.bool
  }

  constructor(props) {
    super(props);
    let defaultValue = roundValue(props.value);
    this.state = {
      Value: defaultValue
    };
  }

  // 在外部使用onBlur的时候会出现两次传进来的value一致 导致State中的Value不变的问题，所以暴露给外部手动修改
  changeStateValue = value => {
    this.setState({
      Value: value
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      let value;
      if (nextProps.value === '-' || nextProps.value === '+') {
        value = nextProps.value;
      } else {
        value = roundValue(nextProps.value);
      }
      this.setState({
        Value: value
      });
    }
  }

  // 点击选中
  click = e => {
    e.target.select();
    if(this.props.onClick) {
      this.props.onClick(e);
    }
  }

  change = e => {
    // negative->判断能否输负数 true->可为负数 false->不可为负数 默认为不可为负数
    const {negative} = this.props;
    const targetValue = e.target.value;
    // 可以为负数
    const canNegative = isNaN(targetValue) && targetValue !== '-';
    // 不可以为负数
    const noNegative = isNaN(targetValue) || targetValue < 0 || targetValue === '-';
    // 关于负数的判定
    const negativeJudgment = negative ? canNegative : noNegative;

    if (negativeJudgment && targetValue !== '.' && targetValue !== '+') {
      // 不合法时的处理...
    } else {
      let formatValue = targetValue === '.' ? '0.' : _.trim(targetValue);
      this.setState({
        Value: formatValue
      });
      // 当输入的是'.', '+'或'-'时，格式化为'0'，不修改state的值，只修改e.target.value的值传给props.onChange事件。
      if (targetValue === '.' || targetValue === '+' || targetValue === '-') {
        formatValue = 0;
      }
      if(this.props.onChange) {
        this.props.onChange(e, Number(formatValue));
      }
    }
  }
  blur = e => {
    const targetValue = e.target.value;
    let formatValue = targetValue === '' ? null : C.round(targetValue);
    // 小数点结尾
    if(/\.$/.test(targetValue)) {
      formatValue = parseInt(targetValue, 10);
      this.setState({
        Value: formatValue
      });
    // '+'或者是'-'
    } else if(/^[-+]$/.test(targetValue)) {
      formatValue = 0;
      this.setState({
        Value: formatValue
      });
    }
    if(this.props.onBlur) {
      e.target.value = formatValue;
      this.props.onBlur(e, formatValue, this.changeStateValue);
    }
  }

  render() {
    const {Value} = this.state;
    const {value, negative, onChange, onBlur, onClick, errorMsg, ...props} = this.props;
    return (
      <div className='qn-form-item' >
        <Input ref={ref => {this.input = ref;}} {...props} value={Value} onChange={this.change} onBlur={this.blur} onClick={this.click}/>
        {this.renderError()}
      </div>
    );
  }
}

export default NumberField;
