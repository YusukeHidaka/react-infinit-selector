import React from 'react'
import ReactDOM from 'react-dom'
import Select from 'react-select'
import {observer} from 'mobx-react';
import LoadingWithScrollSelector from '/kaitori/src/components/selector/loading_with_scroll_selector'

@observer
export default class ReviewFormInner extends React.Component{

  get defaultValueOfSelector (){return this.props.reviewFormStore.selectedServiceId;}
  get selectorWidth (){return 210;}

  constructor(props) {
    super(props);
    this.state = {
      serviceId: this.props.reviewFormStore.selectedServiceId
    }
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  componentDidMount(){
    this.initReviewStar();
  }

  initReviewStar(){
    if(typeof $ === "undefined"){
      return;
    }
    if(typeof $.review_star === "undefined"){
      return;
    }
    if(typeof $.review_star.set_star_size === "undefined"){
      return
    }
    $.review_star.set_star_size($(".popup_wrapper.base"));
  }

  renderServiceSelector(){
    let services = this.props.reviewFormStore.services;
    let options = services.map((s,index) => {return {value:s.id, label:s.name};});
    return(
      <div style={{width: this.selectorWidth}}>
        <LoadingWithScrollSelector
          options={options}
          defaultService={this.props.reviewFormStore.selectedServiceId}
          setServiceId={this.setServiceId.bind(this)}
          />
      </div>
    )
  }

  onClickSubmit(){
    this.props.reviewFormStore.postReview(this.createPostParams());
  }

  setServiceId (serviceId){
    this.setState({serviceId: serviceId});
  }

  createPostParams(){
    let reviewerNameElm = ReactDOM.findDOMNode(this.refs.reviewer_name);
    let reviewerEmailElm = ReactDOM.findDOMNode(this.refs.reviewer_email);
    let reviewerUrlElm = ReactDOM.findDOMNode(this.refs.reviewer_url);
    let contentElm = ReactDOM.findDOMNode(this.refs.content);
    let ratingElm = ReactDOM.findDOMNode(this.refs.rating);
    let agreeTermElm = ReactDOM.findDOMNode(this.refs.agree_term);

    let reviewData = {
        "review": {
          "reviewer_name": reviewerNameElm.value,
          "reviewer_email": reviewerEmailElm.value,
          "reviewer_url": reviewerUrlElm.value,
          "content": contentElm.value,
          "rating": ratingElm.value,
          "service_id": this.state.serviceId,
          "agree_term": agreeTermElm.checked,
        }
    }
    return reviewData;
  }

  render(){
    let defaultServiceId = this.props.reviewFormStore.getDefaultServiceId();
    return (
      <div className="popup_review_inner">
        <h3 className="title">クチコミ投稿フォーム</h3>
        <p className="discription">
          買取業者へのクチコミを投稿お願いします。
          覚えている範囲で構いませんので、実際にあなたが売った商品の名前・型番、
          査定金額、スタッフの対応など含めながら買取の体験談を教えてください。
        </p>
        <div className="popup_review_inner__alert">
          <h2 className="popup_review_inner__alert__header">
            クチコミを投稿する前に
          </h2>
          <p className="popup_review_inner__alert__text">
            ・不満を投稿する場合は、可能な限りお店の良かったポイントも取り上げ、客観性のある投稿をお願いしております。<br />
            ・投稿されたクチコミはクチコミ利用規約に基づいて審査されます。虚偽の内容、推測、立証不可能な断定的内容など、クチコミ利用規約に違反する場合は掲載されません。<br />
            ・連続的に投稿された不自然なクチコミは掲載されません。その他、不自然さを感じた場合は審査により公開されない場合があります。<br />
            ・関係者の方が関係業者に口コミを投稿することはお控えください。悪質な場合は厳重な注意、対処をさせていただく可能性があります。<br />
            ・クチコミ投稿時に投稿者のIPアドレスを取得しております。クチコミ利用規約に違反するクチコミや違法性のあるクチコミを投稿した場合、法律により罰せられる可能性もあります。<br />
            ・プロバイダー責任制限法に基づいて、投稿者の情報開示をさせていただく場合がございます。<br />
          </p>
        </div>
        <form className="wpcrcform hikakaku_form" id="wpcr_commentform" action="javascript:void(0);">
          <div id="wpcr_div_2">
            <input type="hidden" id="frating" name="frating" ref="rating" />
            <input type="hidden" name="companyid" value="52943" />
            <table id="wpcr_table_2">
              <tbody>
                <tr className="form_table" style={{"zIndex":"2", "position":"relative"}}>
                  <td className="label"><label htmlFor="companyid" className="comment-field">業者<i className="co-red">*</i> : </label></td>
                  <td>
                    {this.renderServiceSelector()}
                  </td>
                </tr>
                <tr className="form_table">
                  <td className="label"><label htmlFor="QW-fname" className="comment-field">ニックネーム<span className="co-red">*</span> : </label></td>
                  <td><input className="text-input" type="text" id="QW-fname" name="QW-fname" ref="reviewer_name" /></td>
                </tr>
                <tr className="form_table">
                  <td className="label"><label htmlFor="QW-femail" className="comment-field">メールアドレス<span className="co-red">*</span> : </label></td>
                  <td><input className="text-input" type="text" id="QW-femail" name="QW-femail" ref="reviewer_email" /></td>
                </tr>
                <tr className="form_table">
                  <td className="label"><label htmlFor="QW-femail" className="comment-field">ウェブサイト : </label></td>
                  <td><input className="text-input" type="text" id="QW-fwebsite" name="QW-fwebsite" ref="reviewer_url"  /></td>
                </tr>
                <tr className="form_table">
                  <td>
                    <div className="wpcr_rating">
                      <div className="review_rate_star" data-rate="0" data-maxrate="5" data-hover="1">
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="form_table left">
                  <td colSpan="2" className=""><label htmlFor="NDvYFxEO-ftext" className="comment-field">評価の詳細 <span className="co-red">*</span> : </label></td>
                </tr>
                <tr className="form_table">
                  <td colSpan="2">
                    <textarea ref="content" rows="8" cols="50" placeholder="この買取サービスで買取してもらった際の良かった点、悪かった点など評価の理由を是非教えてください。管理者に承認されると公開されます。"></textarea>
                  </td>
                </tr>
                <tr className="form_table left ">
                  <td colSpan="2" id="wpcr_check_confirm"><small>必須項目 <span className="co-red">*</span> : </small>
                    <div className="wpcr_clear"></div>
                    <input type="checkbox" name="hkcXhhA-fconfirm1" id="fconfirm1" value="1" />
                      <div className="wpcr_fl">
                        <input type="checkbox" name="U-fconfirm2" id="fconfirm2" value="1" ref="agree_term" />
                        <label htmlFor="fconfirm2"><a href="http://hikakaku.com/review-term/" target="_blank">クチコミ利用規約</a>に同意します。</label>
                      </div>
                    <div className="wpcr_clear"></div>
                    <input type="checkbox" name="t-fconfirm3" id="fconfirm3" value="1" />
                  </td>
                </tr>
                <tr className="form_table">
                  <td colSpan="2"><input id="wpcr_submit_btn" name="submitwpcr" type="button" value="評価を送信" onClick={this.onClickSubmit} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </div>
    )
  }
}
