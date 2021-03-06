import React, {Component, PropTypes} from 'react';

class NumberInput extends Component {
  static propTypes = {
    value: PropTypes.number,
    negative: PropTypes.bool
  }
  constructor(props) {
    super(props);
    let defaultValue = props.value;
    if (defaultValue === 0) {
      defaultValue = 0;
    } else if(isNaN(defaultValue) || !defaultValue) {
      defaultValue = '';
    }
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
      this.setState({
        Value: nextProps.value
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
      let formatValue = targetValue === '.' ? '0.' : targetValue.trim();
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
    let formatValue = targetValue === '' ? null : targetValue;
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
    const {value, negative, onChange, onBlur, onClick, ...props} = this.props;
    return (
      <input {...props} value={Value} onChange={this.change} onBlur={this.blur} onClick={this.click}/>
    );
  }
}

export default NumberInput;
