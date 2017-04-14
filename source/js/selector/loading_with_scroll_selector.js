import React from 'react'
import ReactDOM from 'react-dom'
import { throttle } from 'lodash'
import Options from './options'

export default class LoadingWithScrollSelector extends React.Component{
  get DEFAULT_LOAD_NUM (){return 100;}
  get EXTRA_LOAD_NUM (){return 50;}
  get LOADING_POINT (){return 30;}
  get OPTION_HEIGHT (){return 30;}

  constructor (props){
    super(props);
    let defaultIndex = Object.keys(this.props.options).filter( (i) => {
      return this.props.options[i].value == this.props.defaultService;
    });
    if(!this.props.defaultService){defaultIndex = 0}

    this.state = {
      currentOptions: [],
      topCount: 1,
      bottomCount: 1,
      selectedIndex: parseInt(defaultIndex),
      selectedValue: this.props.defaultService ? this.props.options[parseInt(defaultIndex)].label : '業者を選択してください',
      showOptions: false,
      currentPosition: parseInt(defaultIndex)/(this.props.options.length),
      topOption: parseInt(defaultIndex)-this.DEFAULT_LOAD_NUM
    }
    this.handleTouchOutsides = this.handleTouchOutsides.bind(this);
  }

  componentWillMount (){
    this.sliceOptions();
  }

  componentDidMount (){
    let onScroll = this.scrollHandler();
    this._onScroll = throttle((e) => onScroll(e));
  }

  componentWillUnmount (){
    this._onScroll = null;  // 循環参照しているため、明示的に破棄する
  }

  componentWillUpdate (nextProps,nextState){
    if (nextState.showOptions !== this.state.showOptions){
      this.toggleTouchOutsideEvent(nextState.showOptions);
    }
  }

  toggleTouchOutsideEvent (willShow){
    if (willShow){
      document.addEventListener('click', this.handleTouchOutsides, false);
      return;
    }
    document.removeEventListener('click', this.handleTouchOutsides, false);
  }

  handleTouchOutsides (event){
    if (this.wrapper && !this.wrapper.contains(event.target)){
      this.hideOptions();
    }
  }

  hideOptions (){
    this.setState({showOptions: false});
  }

  loadOptionsWithScroll (elm){
    let past = elm.scrollTop;
    let remaining = elm.scrollHeight - (elm.clientHeight + elm.scrollTop);
    let optionsRange = this.setOptionsRange();
    if (past <= this.LOADING_POINT){
      if(this.preventOverLoadTop(optionsRange)){return;}
      this.addLowOptions(elm);
    } else if (remaining <= this.LOADING_POINT){
      if(this.preventOverLoadBottom(optionsRange)){return;}
      this.addHighOptions();
    }
  }

  setOptionsRange (){
    let first = this.state.selectedIndex - this.state.topCount * this.EXTRA_LOAD_NUM;
    let last = this.state.selectedIndex + this.state.bottomCount * this.EXTRA_LOAD_NUM;
    let optionsRange = {first,last};
    return optionsRange;
  }

  preventOverLoadTop (optionsRange){
    if(optionsRange.first > 0){return false;}
    this.setState({currentOptions: this.props.options.slice(0,optionsRange.last)});
    return true;
  }

  preventOverLoadBottom (optionsRange){
    if(optionsRange.last < this.props.options.length){return false;}
    this.setState({currentOptions: this.props.options.slice(optionsRange.first)});
    return true;
  }

  addLowOptions (elm){
    this.setState({
      topCount: this.state.topCount+=1,
      bottomCount: this.state.bottomCount-=1
    });
    this.sliceOptions(elm);
    this.setTopOption();
  }

  setTopOption (){
    let topOptionIndex = Object.keys(this.props.options).filter( (i) => {
      return this.props.options[i].value == this.state.currentOptions[0].value;
    });
    this.setState({topOption: topOptionIndex});
  }

  addHighOptions (){
    this.setState({
      bottomCount: this.state.bottomCount+=1,
      topCount: this.state.topCount-=1
    });
    this.sliceOptions();
    this.setTopOption();
  }

  sliceOptions (elm){
    let optionsRange = this.setOptionsRange();
    let first = optionsRange.first>0 ? optionsRange.first : 0 ;
    let last = optionsRange.last<this.props.options.length ? optionsRange.last : this.props.options.length;
    this.setState({currentOptions: this.props.options.slice(first,last)});
    if(elm){elm.scrollTop = this.EXTRA_LOAD_NUM * this.OPTION_HEIGHT;}
  }

  scrollHandler (){
    let scrollInterval;
    //0.01秒前のポジションと比べる
    return (e)=>{
      let pastPosition = e.target.scrollTop;
      let elm = e.target;
      if(scrollInterval){ return; }

      scrollInterval = setInterval(( () => {
        this.loadOptionsWithScroll(elm);
        this.setScrollBarPosition(elm);

        if (pastPosition===elm.scrollTop){//スクロールが止まった時に関数から抜ける
          clearInterval(scrollInterval);
          scrollInterval = undefined;
        } else {//スクロールしている時
          pastPosition = elm.scrollTop;
        }
      }).bind(this), 1);
    }
  }

  setScrollBarPosition (elm){
    let totalOptionsLength = this.props.options.length * this.OPTION_HEIGHT;
    let currenOptionstLength = (this.state.topOption * this.OPTION_HEIGHT) + elm.scrollTop;
    this.setState({currentPosition: currenOptionstLength / totalOptionsLength});
  }

  onSelected (e){
    this.setState({
      selectedValue: e.target.innerText,
      showOptions: !this.state.showOptions
    });
    const serviceId = e.target.getAttribute('data-id');
    if(serviceId==null){return;}
    this.props.setServiceId(serviceId);
  }

  renderOptions (){
    if (this.state.showOptions === false){return;}
    return (
      <Options
        currentOptions = {this.state.currentOptions}
        selectedValue = {this.state.selectedValue}
        onSelected = {this.onSelected.bind(this)}
        currentPosition = {this.state.currentPosition}
        _onScroll = {this._onScroll}
        selectedOptionBoxHeight = {this.OPTION_HEIGHT}
      />
    )
  }

  render (){
    return　(
      <div className="loading_with_scroll_selector" style={{width:this.selectorWidth}} ref={ref => this.wrapper = ref}>
        <div className="selected_option_box" onClick={this.onSelected.bind(this)}>
          {this.state.selectedValue}
        </div>
        {this.renderOptions()}
      </div>
    )
  }
}

LoadingWithScrollSelector.propTypes = {
  options: React.PropTypes.array,
  defaultService: React.PropTypes.number,
  setServiceId: React.PropTypes.func,
};
