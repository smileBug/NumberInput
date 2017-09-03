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
      this.setState({
        Value: targetValue === '.' ? '0.' : targetValue.trim()
      });
      if (targetValue === '.' || targetValue === '+' || targetValue === '-') {
        e.target.value = 0;
      }
      if(this.props.onChange) {
        this.props.onChange(e);
      }
    }
  }
  blur = e => {
    const targetValue = e.target.value;
    if(/\.$/.test(targetValue)) {
      this.setState({
        Value: parseInt(targetValue, 10)
      });
    } else if(/^[-+]$/.test(targetValue)) {
      this.setState({
        Value: 0
      });
    }
    if(this.props.onBlur) {
      this.props.onBlur(e);
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
