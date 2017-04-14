import React from 'react'
import ReactDOM from 'react-dom'

export default class Options extends React.Component{

  get SCROOL_BAR_HEIGHT_RATE (){return 1/5;}
  get OPTIONS_HEIGHT (){return this.props.selectedOptionBoxHeight * 5;}

  constructor (props){
    super(props);
  }

  componentDidMount (){
    let selectedOption = document.getElementsByClassName("selected_option")[0];
    if(!selectedOption){ return; }
    let topPos = selectedOption.offsetTop;
    let options = document.getElementsByClassName("options")[0];
    options.scrollTop = topPos-(options.offsetTop);
  }

  styles (){
    return {
      scrollbar: {
        height: this.OPTIONS_HEIGHT * this.SCROOL_BAR_HEIGHT_RATE,
        top: this.props.currentPosition *(1-this.SCROOL_BAR_HEIGHT_RATE) * this.OPTIONS_HEIGHT
      },
    };
  }

  createOptions (val,index){
    const className = this.props.selectedValue==val.label ? 'selected_option' : '' ;
    return (
      <li key={val.value} className={className} onClick={this.props.onSelected} data-id={val.value}>
        {val.label}
      </li>
    );
  }

  render (){
    const styles = this.styles();
    let options = this.props.currentOptions.map((val,index) => this.createOptions(val,index));
    return (
      <div className="options_wrapper">
        <ul className="options" onScroll={this.props._onScroll} ref={ref => this.options = ref}>
          {options}
        </ul>
        <div className="options_scrollbar" style={styles.scrollbar}></div>
      </div>
    )
  }
}

Options.propTypes = {
  currentOptions: React.PropTypes.array,
  selectedValue: React.PropTypes.string,
  onSelected: React.PropTypes.func,
  currentPosition: React.PropTypes.number,
  _onScroll: React.PropTypes.func,
  selectedOptionBoxHeight: React.PropTypes.number,
};
